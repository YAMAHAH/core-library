
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using DataService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DataService.Infrastructure.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        DbContextOptions<DbContextBase> options { get; set; }
        IUnitOfWork UnitOfWorkRef { get; set; }
        void UseTransaction(IUnitOfWork unitofWork);
        DbContextBase DbContext { get; }
        #region 数据库事务保存控制
        bool Commit();
        void Rollback();

        int SaveChanges();

        int AcceptAllChanges();

        #endregion
        DbSet<T> EntitySet<T>() where T : EntityBase;
        #region 数据库增删改查
        object GetByKey(Type type, object key);
        T GetByKey<T>(object key) where T : EntityBase;
        T GetByKeyReadOnly<T>(Func<T, bool> getKey) where T : EntityBase;
        void UpdateEntityValues<T>(T existEntity, T nowEntity) where T : EntityBase;
        void UpdateEntityState<T>(T entity, EntityState entityState) where T : EntityBase;
        EntityEntry<T> InsertEntity<T>(T entity) where T : EntityBase;
        void InsertEntities<T>(params T[] entities) where T : EntityBase;
        EntityEntry<T> DeleteEntity<T>(T entity) where T : EntityBase;
        void DeleteEntities<T>(params T[] entities) where T : EntityBase;
        EntityEntry<T> UpdateEntity<T>(T entity) where T : EntityBase;
        void UpdateEntities<T>(params T[] entities) where T : EntityBase;
        EntityEntry<T> AttachEntity<T>(T entity) where T : EntityBase;
        void AttachEntities<T>(params T[] entities) where T : EntityBase;
        int ExecuteSqlCommand(string sql, params object[] parameters);
        IQueryable<T> QueryAsReadOnly<T>() where T : EntityBase;
        IQueryable<T> Query<T>() where T : EntityBase;
        IQueryable<T> Query<T>(Expression<Func<T, bool>> filterCondition) where T : EntityBase;
        EntityEntry GetEntry<T>(T entity) where T : EntityBase;
        PageInfo<object> Query<T, TOrderBy>(int pageIndex, int pageSize, Expression<Func<T, bool>> where,
         Expression<Func<T, TOrderBy>> orderby, Func<IQueryable<T>, List<object>> selector)
         where T : EntityBase where TOrderBy : class;
        List<object> Query<T, TOrderBy>(Expression<Func<T, bool>> where, Expression<Func<T, TOrderBy>> orderby,
        Func<IQueryable<T>, List<object>> selector) where T : EntityBase;
        void UpdateValues<T, T1, TKey>(T existEntity, T nowEntity, Func<T, List<T1>> getChilds, Func<T1, TKey> getCompareKey, Func<T1, T1, bool> getKey) where T : EntityBase where T1 : EntityBase;
        void UpdateValues<T, TKey>(List<T> getExistChilds, List<T> getNowChilds, Func<T, TKey> getCompareKey, Func<T, T, bool> getKey) where T : EntityBase;
        List<T> GetAllNodes<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase;
        void DeleteNode<T>(T node, Func<T, IEnumerable<T>> getChilds) where T : EntityBase;
        void AddNodeValues<T>(T existNode, T nowNode, Func<T, IList<T>> getChilds, Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase;
        void UpdateNodeValues<T, TKey>(T existNode, T nowNode, Func<T, List<T>> getChilds, Func<T, TKey> getCompareKey, Func<T, T, bool> getEntityKey, Func<T, T> getNewNode, Action<T, T> getConfig) where T : EntityBase;
        void UpdateNodeDetailValues<T, TDetail, TKey>(T existNode, T nowNode, Func<T, List<T>> getChilds,
          List<Func<T, List<TDetail>>> getDetails, List<Func<TDetail, TKey>> getDetailCompareKey, Func<T, T, bool> getChildKey,
           List<Func<TDetail, TDetail, bool>> getDetailKey) where T : EntityBase where TDetail : EntityBase;
        List<T> GetTreeNodes<T>(T node, Expression<Func<T, IEnumerable<T>>> getCollection, Func<T, IEnumerable<T>> getChilds) where T : EntityBase;
        NodeOrderInfo CalaOrd<T>(T node, Action<T, NodeOrderInfo> headerConfig, Action<T, T> middleConfig,
        Action<T, int> footerConfig, Func<T, IEnumerable<T>> getChilds, NodeOrderInfo nodeInfo);
        void UpdateLocalNodeValues<T>(T node, Func<T, List<T>> getChilds, Action<T> setPropertyValue);
        #endregion
    }
}