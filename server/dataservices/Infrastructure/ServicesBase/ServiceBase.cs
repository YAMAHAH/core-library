
using System;
using AutoMapper;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;
using DataService.ServicesBase;
using Microsoft.EntityFrameworkCore;

namespace DataService
{
    public abstract class ServiceBase : IServiceBase
    {
        public ServiceBase(IUnitOfWork unitOfWork, bool shareTransaction = false)
        {
            this.UnitOfWork = unitOfWork;
            this.ShareTransaction = shareTransaction;
        }
        protected bool ShareTransaction;
        private IUnitOfWork xUnitOfWork;
        protected IUnitOfWork UnitOfWork
        {
            get
            {
                if (xUnitOfWork == null)
                {
                    xUnitOfWork = UnitFactoryService.GetUnitOfWork();
                }
                if (xUnitOfWork != null && this.ShareTransaction)
                {
                    xUnitOfWork = UnitFactoryService.GetUnitOfWork(xUnitOfWork);
                }
                return xUnitOfWork;
            }
            set { xUnitOfWork = value; }
        }

        protected DbContextBase Store
        {
            get
            {
                return UnitOfWork.DbContext;
            }
        }

        protected DbSet<T> EntitySet<T>() where T : EntityBase
        {
            return UnitOfWork.DbContext.Set<T>();
        }


        // /// <summary>
        // /// 更新1对多关系的实体值
        // /// </summary>
        // ///<param name="existEntity">数据库存在的实体</param>
        // ///<param name="nowEntity">当前存在的实体</param>
        // ///<param name="getChilds">获取1对多关系的实体回调</param>
        // ///<param name="getCompareKey">实体差异比较条件回调</param>
        // ///<param name="getKey">实体更新获取数据库实体的条件回调</param>
        // /// <returns>VOID/returns>
        // protected void UpdateValues<T, T1, TKey>(T existEntity, T nowEntity, Func<T, List<T1>> getChilds,
        //  Func<T1, TKey> getCompareKey, Func<T1, T1, bool> getKey) where T : EntityBase where T1 : EntityBase
        // {
        //     SetEntityValues(existEntity, nowEntity);
        //     var entityDiff = new EntityDiff<T1, TKey>(getChilds(existEntity), getChilds(nowEntity), getCompareKey);
        //     // DeleteEntities(entityDiff.DeletedEntities);
        //     entityDiff.DeletedEntities.ForEach(p => SetEntityState(p, EntityState.Deleted));
        //     //   AddEntities(getChilds(existEntity), entityDiff.AddedEntities);
        //     getChilds(existEntity).AddRange(entityDiff.AddedEntities);
        //     //  UpdateEntities(getChilds(existEntity), entityDiff.ModifiedEntities, getEntityKey);
        //     foreach (var newPost in entityDiff.ModifiedEntities)
        //     {
        //         var oldPost = getChilds(existEntity).Where(p => getKey(newPost, p)).FirstOrDefault();
        //         SetEntityValues(oldPost, newPost);
        //     }
        // }

        // protected void UpdateValues<T>(T existEntity, T nowEntity) where T : EntityBase
        // {
        //     SetEntityValues(existEntity, nowEntity);
        // }

        // protected T GetByKeyReadOnly<T>(Func<T, bool> getKey) where T : EntityBase
        // {
        //     return UnitOfWork.DbContext.Set<T>().AsNoTracking().FirstOrDefault(getKey);
        // }
        // protected T GetByKey<T>(object key) where T : EntityBase
        // {
        //     return UnitOfWork.DbContext.Set<T>().Find(key);
        // }
        // protected object GetByKey(Type type, object key)
        // {
        //     return UnitOfWork.DbContext.Find(type, key);
        // }
        // /// <summary>
        // /// 使用当前实体值去更新数据库对应的实体值
        // /// </summary>
        // ///<param name="entity">数据库存在的实体</param>
        // ///<param name="nowEntity">当前的实体</param>
        // /// <returns>Void</returns>
        // protected void SetEntityValues<T>(T existEntity, T nowEntity) where T : EntityBase
        // {
        //     UnitOfWork.DbContext.Entry(existEntity).CurrentValues.SetValues(nowEntity);
        // }
        // /// <summary>
        // /// 设置实体状态
        // /// </summary>
        // ///<param name="entity">设置的实体</param>
        // ///<param name="entityState">设置实体的状态</param>
        // /// <returns>Void</returns>
        // protected void SetEntityState<T>(T entity, EntityState entityState) where T : EntityBase
        // {
        //     UnitOfWork.DbContext.Entry(entity).State = entityState;
        // }

        // /// <summary>
        // /// </summary>
        // /// <returns></returns>
        // protected void UpdateNodeValues<T, TKey>(T existNode, T nowNode, Func<T, List<T>> getChilds, Func<T, TKey> getCompareKey,
        //  Func<T, T, bool> getEntityKey, Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase
        // {
        //     SetEntityValues(existNode, nowNode);
        //     var entityDiff = new EntityDiff<T, TKey>(getChilds(existNode), getChilds(existNode), getCompareKey);
        //     //删除
        //     entityDiff.DeletedEntities.ForEach(node => DeleteNode(node, getChilds));
        //     //新增
        //     entityDiff.AddedEntities.ForEach(node =>
        //     {
        //         var newChildNode = getNewNode(existNode);
        //         // getConfig(newChildNode, node);
        //         Insert(newChildNode);
        //         AddNodeValues(newChildNode, node, getChilds, getNewNode, getConfig);
        //     });
        //     //更新
        //     entityDiff.ModifiedEntities.ForEach(modNode =>
        //     {
        //         var existEntity = getChilds(existNode).Where(n => getEntityKey(modNode, n)).FirstOrDefault();
        //         UpdateNodeValues(existEntity, modNode, getChilds, getCompareKey, getEntityKey, getNewNode, getConfig);
        //     });
        // }

        // protected void AddNodeValues<T>(T existNode, T nowNode, Func<T, IList<T>> getChilds,
        //  Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase
        // {
        //     SetEntityValues(existNode, nowNode);
        //     getConfig(existNode, nowNode);
        //     foreach (var addNode in getChilds(nowNode))
        //     {
        //         var newChildNode = getNewNode(existNode);
        //         getChilds(existNode).Add(newChildNode);
        //         Insert(newChildNode);
        //         AddNodeValues(newChildNode, addNode, getChilds, getNewNode, getConfig);
        //     }
        // }

        // protected EntityEntry Insert<T>(T entity) where T : EntityBase
        // {
        //     return UnitOfWork.DbContext.Set<T>().Add(entity);
        // }

        // protected void DeleteNode<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase
        // {
        //     foreach (var delNode in GetAllNodes(node, getChilds))
        //     {
        //         UnitOfWork.DbContext.Entry(delNode).State = EntityState.Deleted;
        //     }
        // }

        // protected List<T> GetAllNodes<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase
        // {
        //     var allNodes = new List<T>();
        //     allNodes.Add(node);
        //     foreach (var childNode in getChilds(node))
        //     {
        //         allNodes.AddRange(GetAllNodes(childNode, getChilds));
        //     }
        //     return allNodes;
        // }

        public int SaveChanges()
        {
            try
            {
                return this.UnitOfWork.SaveChanges();
            }
            catch
            {
                return 0;
            }

        }

        public bool Commit()
        {
            try
            {
                return this.UnitOfWork.Commit();
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        public void Rollback()
        {
            try
            {
                this.UnitOfWork.Rollback();
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        public int AcceptAllChanges()
        {
            return this.UnitOfWork.AcceptAllChanges();
        }

        protected ResponseMessage<T> okResponse<T>(T resultObject)
        {
            var resMsg = new ResponseMessage<T>();
            resMsg.ReturnStatus = true;
            resMsg.Playload.Add(Mapper.Map<T>(resultObject));
            return resMsg;
        }
        protected ResponseMessage<T> BadResponse<T>(T resultObject)
        {
            var resMsg = new ResponseMessage<T>();
            resMsg.ReturnStatus = true;
            resMsg.ReturnMessages.Add("Bad Response");
            resMsg.Playload.Add(Mapper.Map<T>(resultObject));
            return resMsg;
        }
        // protected int CalaOrd<T>(T node, Action<T, int, int> headerConfig, Action<T> middleConfig,
        //  Action<T, int> footerConfig, Func<T, IEnumerable<T>> getChilds, int initNum = 1, int ord = 1)
        // {
        //     headerConfig(node, initNum, ord);
        //     getChilds(node).ForEach(nd =>
        //     {
        //         middleConfig(node);
        //         ord++;
        //         initNum++;
        //         initNum = CalaOrd(nd, headerConfig, middleConfig, footerConfig, getChilds, initNum, ord);
        //     });
        //     initNum++;
        //     footerConfig(node, initNum);
        //     return initNum;
        // }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                    this.UnitOfWork.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~ServiceBase() {
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



        #endregion
    }
    public enum StoreType
    {
        MsSql = 1,
        LiteSql = 2,
        MySql = 3,
    }
}
