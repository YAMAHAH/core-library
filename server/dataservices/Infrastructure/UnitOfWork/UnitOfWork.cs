using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using DataService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using DataService.Extensions;

namespace DataService.Infrastructure.UnitOfWork
{
    public abstract class UnitOfWork : IUnitOfWork, IDisposable
    {
        protected DbContextBase xDbContextBase;
        public DbContextBase DbContext
        {
            get
            {
                if (xDbContextBase == null)
                {
                    GetDbContext();
                }
                return xDbContextBase;
            }
        }

        protected virtual DbContextBase GetDbContext()
        {
            return null;
        }

        private readonly object sync = new object();
        public bool IsCommited { get; set; }

        public bool Commit()
        {

            if (IsCommited)
            {
                return false;
            }
            try
            {
                //   int result = 0;
                lock (sync)
                {
                    DbContext.CommittableTransaction?.Commit();
                    IsCommited = true;
                }
                return IsCommited;
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException != null && e.InnerException.InnerException is Exception)
                {
                    Exception sqlEx = e.InnerException.InnerException as Exception;
                    Rollback();
                }
            }
            return false;
        }
        public void Rollback()
        {
            IsCommited = false;
            DbContext.CommittableTransaction.Rollback();
        }
        public int SaveChanges()
        {
            return DbContext.SaveChanges();
        }
        public int AcceptAllChanges()
        {
            var result = 0;
            try
            {
                result = this.SaveChanges();
                if (this.Commit()) return result;
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return 0;
            }
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                    this.DbContext.Dispose();
                    if (this.UnitOfWorkRef == null)
                        this.DbContext.CommittableTransaction.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~UnitOfWork() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        void IDisposable.Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }


        public IUnitOfWork UnitOfWorkRef { get; set; }

        public DbContextOptions<DbContextBase> options
        {
            get; set;
        }

        public void UseTransaction(IUnitOfWork pUnitOfWork)
        {
            this.DbContext.UseTransaction(pUnitOfWork.DbContext);
        }
        #endregion
        protected string ConnString(string name)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            var configuration = builder.Build();

            string connectionString = configuration.GetConnectionString(name);
            return connectionString;
        }

        #region 一对多实体增删改查
        /// <summary>
        /// 更新1对多关系的实体值
        /// </summary>
        ///<param name="existEntity">数据库存在的实体</param>
        ///<param name="nowEntity">当前存在的实体</param>
        ///<param name="getChilds">获取1对多关系的实体回调</param>
        ///<param name="getCompareKey">实体差异比较条件回调</param>
        ///<param name="getKey">实体更新获取数据库实体的条件回调</param>
        /// <returns>VOID/returns>
        public void UpdateValues<T, T1, TKey>(T existEntity, T nowEntity, Func<T, List<T1>> getChilds,
         Func<T1, TKey> getCompareKey, Func<T1, T1, bool> getKey) where T : EntityBase where T1 : EntityBase
        {
            UpdateEntityValues(existEntity, nowEntity);
            var entityDiff = new EntityDiff<T1, TKey>(getChilds(existEntity), getChilds(nowEntity), getCompareKey);
            entityDiff.DeletedEntities.ForEach(p => UpdateEntityState(p, EntityState.Deleted));
            getChilds(existEntity).AddRange(entityDiff.AddedEntities);
            foreach (var modEntity in entityDiff.ModifiedEntities)
            {
                var oldEntity = getChilds(existEntity).Where(p => getKey(modEntity, p)).FirstOrDefault();
                UpdateEntityValues(oldEntity, modEntity);
            }
        }

        public void UpdateValues<T, TKey>(List<T> getExistLists, List<T> getNowLists, Func<T, TKey> getCompareKey,
         Func<T, T, bool> getKey) where T : EntityBase
        {
            var entityDiff = new EntityDiff<T, TKey>(getExistLists, getNowLists, getCompareKey);
            entityDiff.DeletedEntities.ForEach(p => UpdateEntityState(p, EntityState.Deleted));
            getExistLists.AddRange(entityDiff.AddedEntities);
            foreach (var modEntity in entityDiff.ModifiedEntities)
            {
                var oldEntity = getExistLists.Where(p => getKey(modEntity, p)).FirstOrDefault();
                UpdateEntityValues(oldEntity, modEntity);
            }
        }
        public void UpdateValues<T, TListEntity, TKey>(T existEntity, T nowEntity, List<Func<T, List<TListEntity>>> getLists,
         List<Func<TListEntity, TKey>> getListCompareKey, List<Func<TListEntity, TListEntity, bool>> getListKey)
         where T : EntityBase where TListEntity : EntityBase
        {
            for (int i = 0; i < getLists.Count; i++)
            {
                UpdateValues(getLists[i](existEntity), getLists[i](nowEntity), getListCompareKey[i], getListKey[i]);
            }
        }

        #endregion

        #region 结点增删改查

        /// <summary>
        /// </summary>
        /// <returns></returns>
        public void UpdateNodeValues<T, TKey>(T existNode, T nowNode, Func<T, List<T>> getChilds, Func<T, TKey> getCompareKey,
         Func<T, T, bool> getEntityKey, Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase
        {
            UpdateEntityValues(existNode, nowNode);
            var entityDiff = new EntityDiff<T, TKey>(getChilds(existNode), getChilds(nowNode), getCompareKey);
            //删除
            entityDiff.DeletedEntities.ForEach(node => DeleteNode(node, getChilds));
            //新增
            entityDiff.AddedEntities.ForEach(node =>
            {
                var newChildNode = getNewNode(existNode);
                // getConfig(newChildNode, node);
                InsertEntity(newChildNode);
                getChilds(existNode).Add(newChildNode);
                AddNodeValues(newChildNode, node, getChilds, getNewNode, getConfig);
            });
            //更新
            entityDiff.ModifiedEntities.ForEach(modNode =>
            {
                var existEntity = getChilds(existNode).Where(n => getEntityKey(modNode, n)).FirstOrDefault();
                UpdateNodeValues(existEntity, modNode, getChilds, getCompareKey, getEntityKey, getNewNode, getConfig);
            });
        }

        public void UpdateNodeDetailValues<T, TDetail, TKey>(T existNode, T nowNode, Func<T, List<T>> getChilds,
         List<Func<T, List<TDetail>>> getDetails, List<Func<TDetail, TKey>> getDetailCompareKey, Func<T, T, bool> getChildKey,
          List<Func<TDetail, TDetail, bool>> getDetailKey) where T : EntityBase where TDetail : EntityBase
        {
            for (int i = 0; i < getDetails.Count; i++)
            {
                UpdateValues(existNode, nowNode, getDetails[i], getDetailCompareKey[i], getDetailKey[i]);
            }
            foreach (var childNode in getChilds(existNode))
            {
                var newNode = getChilds(nowNode).Find(nd => getChildKey(childNode, nd));
                UpdateNodeDetailValues(childNode, newNode, getChilds, getDetails, getDetailCompareKey, getChildKey, getDetailKey);
            }
        }

        public void AddNodeValues<T>(T existNode, T nowNode, Func<T, IList<T>> getChilds,
         Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase
        {
            //排除主键
            getConfig(existNode, nowNode);
            UpdateEntityValues(existNode, nowNode);

            foreach (var addNode in getChilds(nowNode))
            {
                var newChildNode = getNewNode(existNode);
                InsertEntity(newChildNode);
                getChilds(existNode).Add(newChildNode);
                AddNodeValues(newChildNode, addNode, getChilds, getNewNode, getConfig);
            }
        }
        public void DeleteNode<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase
        {
            foreach (var delNode in GetAllNodes(node, getChilds))
            {
                DbContext.Entry(delNode).State = EntityState.Deleted;
            }
        }

        public List<T> GetAllNodes<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase
        {
            var allNodes = new List<T>();
            allNodes.Add(node);
            foreach (var childNode in getChilds(node))
            {
                allNodes.AddRange(GetAllNodes(childNode, getChilds));
            }
            return allNodes;
        }

        public List<T> GetTreeNodes<T>(T node, Expression<Func<T, IEnumerable<T>>> getCollection, Func<T, IEnumerable<T>> getChilds) where T : EntityBase
        {
            List<T> treeNodes = new List<T>();
            DbContext.Entry(node).Collection<T>(getCollection).Load();
            treeNodes.Add(node);
            foreach (var childNode in getChilds(node))
            {
                treeNodes.AddRange(GetTreeNodes(childNode, getCollection, getChilds));
            }
            return treeNodes;
        }
        public NodeOrderInfo CalaOrd<T>(T node, Action<T, NodeOrderInfo> headerConfig, Action<T, T> middleConfig,
        Action<T, int> footerConfig, Func<T, IEnumerable<T>> getChilds, NodeOrderInfo nodeOrderInfo)
        {
            headerConfig(node, nodeOrderInfo);
            getChilds(node).ForEach(nd =>
           {
               middleConfig(nd, node);
               nodeOrderInfo.Ord++;
               nodeOrderInfo.InitNum++;
               nodeOrderInfo = CalaOrd(nd, headerConfig, middleConfig, footerConfig, getChilds, nodeOrderInfo);
           });
            nodeOrderInfo.InitNum++;
            footerConfig(node, nodeOrderInfo.InitNum);
            return nodeOrderInfo;
        }
        public void UpdateLocalNodeValues<T>(T node, Func<T, List<T>> getChilds, Action<T> setPropertyValue)
        {
            setPropertyValue(node);
            foreach (var child in getChilds(node))
            {
                UpdateLocalNodeValues(child, getChilds, setPropertyValue);
            }
        }
        #endregion

        #region 单个实体增删改查
        public DbSet<T> EntitySet<T>() where T : EntityBase
        {
            return DbContext.Set<T>();
        }
        public T GetByKeyReadOnly<T>(Func<T, bool> getKey) where T : EntityBase
        {
            return DbContext.Set<T>().AsNoTracking().FirstOrDefault(getKey);
        }
        public T GetByKey<T>(object key) where T : EntityBase
        {
            return DbContext.Set<T>().Find(key);
        }
        public object GetByKey(Type type, object key)
        {
            return DbContext.Find(type, key);
        }
        /// <summary>
        /// 使用当前实体值去更新数据库对应的实体值
        /// </summary>
        ///<param name="entity">数据库存在的实体</param>
        ///<param name="nowEntity">当前的实体</param>
        /// <returns>Void</returns>
        public void UpdateEntityValues<T>(T existEntity, T nowEntity) where T : EntityBase
        {
            DbContext.Entry(existEntity).CurrentValues.SetValues(nowEntity);
        }
        /// <summary>
        /// 设置实体状态
        /// </summary>
        ///<param name="entity">设置的实体</param>
        ///<param name="entityState">设置实体的状态</param>
        /// <returns>Void</returns>
        public void UpdateEntityState<T>(T entity, EntityState entityState) where T : EntityBase
        {
            DbContext.Entry(entity).State = entityState;
        }
        public EntityEntry<T> InsertEntity<T>(T entity) where T : EntityBase
        {
            return DbContext.Set<T>().Add(entity);
        }
        public void InsertEntities<T>(params T[] entities) where T : EntityBase
        {
            DbContext.Set<T>().AddRange(entities);
        }
        public EntityEntry<T> DeleteEntity<T>(T entity) where T : EntityBase
        {
            return DbContext.Set<T>().Remove(entity);
        }
        public void DeleteEntities<T>(params T[] entities) where T : EntityBase
        {
            DbContext.Set<T>().RemoveRange(entities);
        }
        public EntityEntry<T> UpdateEntity<T>(T entity) where T : EntityBase
        {
            return DbContext.Set<T>().Update(entity);
        }
        public void UpdateEntities<T>(params T[] entities) where T : EntityBase
        {
            DbContext.UpdateRange(entities);
        }
        public EntityEntry<T> AttachEntity<T>(T entity) where T : EntityBase
        {
            return DbContext.Attach(entity);
        }
        public void AttachEntities<T>(params T[] entities) where T : EntityBase
        {
            DbContext.AttachRange(entities);
        }
        public int ExecuteSqlCommand(string sql, params object[] parameters)
        {
            return DbContext.Database.ExecuteSqlCommand(sql, parameters);
        }

        public IQueryable<T> QueryAsReadOnly<T>() where T : EntityBase
        {
            return DbContext.Set<T>().AsNoTracking().AsQueryable();
        }
        public IQueryable<T> Query<T>() where T : EntityBase
        {
            return DbContext.Set<T>().AsQueryable();
        }
        public IQueryable<T> Query<T>(Expression<Func<T, bool>> filterCondition) where T : EntityBase
        {
            return DbContext.Set<T>().AsNoTracking().Where(filterCondition).AsQueryable();
        }

        public EntityEntry GetEntry<T>(T entity) where T : EntityBase
        {
            return DbContext.Entry(entity);
        }
        public PageInfo<object> Query<T, TOrderBy>(int pageIndex, int pageSize, Expression<Func<T, bool>> where,
         Expression<Func<T, TOrderBy>> orderby, Func<IQueryable<T>, List<object>> selector)
         where T : EntityBase where TOrderBy : class
        {
            if (selector == null)
            {
                throw new ArgumentNullException("selector");
            }

            if (pageIndex <= 0)
            {
                pageIndex = 1;
            }

            if (pageSize <= 0)
            {
                pageSize = 10;
            }

            IQueryable<T> query = DbContext.Set<T>();
            if (where != null)
            {
                query = query.Where(where);
            }
            int count = query.Count();

            if (pageIndex * pageSize > count)
            {
                pageIndex = count / pageSize;
            }
            if (count % pageSize > 0)
            {
                pageIndex++;
            }

            if (pageIndex <= 0)
            {
                pageIndex = 1;
            }

            if (orderby != null)
            {
                query = query.OrderBy(orderby);
            }
            return new PageInfo<object>(pageIndex, pageSize, count, selector(query));
        }
        public List<object> Query<T, TOrderBy>(Expression<Func<T, bool>> where, Expression<Func<T, TOrderBy>> orderby,
         Func<IQueryable<T>, List<object>> selector) where T : EntityBase
        {
            if (selector == null)
            {
                throw new ArgumentNullException("selector");
            }
            IQueryable<T> query = DbContext.Set<T>();
            if (where != null)
            {
                query = query.Where(where);
            }
            if (orderby != null)
            {
                query = query.OrderBy(orderby);
            }
            return selector(query);
        }
        #endregion
    }
    public class NodeOrderInfo
    {
        public int InitNum { get; set; } = 1;
        public int Ord { get; set; } = 1;
    }
    public class PageInfo<TEntity> where TEntity : class
    {
        public PageInfo(int index, int pageSize, int count, List<TEntity> list)
        {
            Index = index;
            PageSize = pageSize;
            Count = count;
            List = list;
        }

        public int Index { get; private set; }
        public int PageSize { get; private set; }
        public int Count { get; private set; }
        public List<TEntity> List { get; private set; }
    }


}
