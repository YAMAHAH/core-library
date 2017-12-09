using System;

namespace DataService.Models
{
    public static class ModelConvertExtends
    {
        public static dest ToModel<src, dest>(this src source, Func<dest> action) where src : EntityBase
        {
            return action.Invoke();
        }
        public static dest Map<src, dest>(this src source, Func<src, dest> action) where src : EntityBase
        {
            return action.Invoke(source);
        }
        public static dest ToModelList<src, dest>(this src source, Func<dest> action) where src : EntityBase
        {
            return action.Invoke();
        }
        public static dest ToViewModelList<src, dest>(this src source, Func<dest> action) where src : EntityBase
        {
            return action.Invoke();
        }
    }
}