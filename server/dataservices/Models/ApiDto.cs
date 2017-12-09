using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using DataService.Extensions;

namespace DataService.Models
{
    public class EntityDiff<T, TKey> where T : EntityBase
    {
        public EntityDiff(IEnumerable<T> existEntries, IEnumerable<T> nowEntries, Func<T, TKey> getKey)
        {
            this.existEntries = existEntries;
            this.nowEntries = nowEntries;
            this.getKey = getKey;
            this.Cala();
        }
        private IEnumerable<T> existEntries;
        private IEnumerable<T> nowEntries;
        private Func<T, TKey> getKey;

        public List<T> AddedEntities { get; set; } = new List<T>();
        public List<T> DeletedEntities { get; set; } = new List<T>();
        public List<T> ModifiedEntities { get; set; } = new List<T>();
        public bool HasValue
        {
            get
            {
                return (AddedEntities.Count > 0 || DeletedEntities.Count > 0 || ModifiedEntities.Count > 0);
            }
        }
        void Cala()
        {
            AddedEntities = nowEntries.Except(existEntries, getKey).ToList();
            DeletedEntities = existEntries.Except(nowEntries, getKey).ToList();
            ModifiedEntities = nowEntries.Except(AddedEntities, getKey).ToList();
        }
    }

    public class RequestMessage<T>
    {
        public IEnumerable<T> Playload { get; set; }
        public int PageSize { get; set; }
        public int currentPageNumber { get; set; }
        public string SortExp { get; set; }
        public string FilterExp { get; set; }
    }
    public class ResponseMessage<T>
    {
        public bool ReturnStatus { get; set; }
        public int StatusCode { get; set; }
        public List<string> ReturnMessages { get; set; } = new List<string>();
        public Hashtable ValidationErrors { get; set; } = new Hashtable();
        public bool IsAuthenicated { get; set; }
        public IList<T> Playload { get; set; } = new List<T>();
        public int PageSize { get; set; }
        public int currentPageNumber { get; set; }
        public int TotalPages { get; set; }
        public int TotalRows { get; set; }
    }

    public class ApiDto<T>
    {
        public ApiDto()
        {
            this.ValidationErrors = new Hashtable();
            this.ReturnMessages = new List<string>();
            this.Playload = new List<T>();
        }
        public bool ReturnStatus { get; set; }
        public List<string> ReturnMessages { get; set; }
        public Hashtable ValidationErrors { get; set; }
        public bool IsAuthenicated { get; set; }
        public IList<T> Playload { get; set; }
        public QueryOptions Options { get; set; }
    }

    public class QueryOptions
    {
        public int TotalPages { get; set; }
        public int TotalRows { get; set; }
        public int PageSize { get; set; }
        public int currentPageNumber { get; set; }
        public string SortExpression { get; set; }
        public string FilterExpression { get; set; }
    }
}