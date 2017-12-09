using System;
using System.Collections.Generic;

namespace DataService.Models
{
    public class OrderHeader : EntityBase
    {
        public int OrderHeaderId { get; set; }
        public string OrderHeaderNo { get; set; }
        public string CustomerOrderNo { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        // private DateTime? xOrderDelivery = default(DateTime?);
        public DateTime? OrderDelivery { get; set; }
        public int PartnerId { get; set; }
        public virtual List<OrderDetail> OrderDetailRows { get; set; }
        public bool SF_Finish { get; set; }
        public bool SF_Cancel { get; set; }
    }
    public class OrderDetail : EntityBase
    {
        public int OrderDetailId { get; set; }
       
        public int Ord { get; set; }
        public int ProductVersionId { get; set; }
        public ProductVersion ProductVersion { get; set; }
        public double OrderTotal { get; set; }
        public double OrderFinishTotal { get; set; }
        public double OrderLeftTotal { get; set; }
        public DateTime? OrderDetailDelivery { get; set; }
         public int OrderHeaderId { get; set; }
        public OrderHeader OrderHeader { get; set; }
        public double Price { get; set; }
        public double CostPrice { get; set; }
        public double DisCount { get; set; }
        public string CustomerOrderNo { get; set; }
        public string Rem { get; set; }
        public bool SF_MxFin { get; set; }


    }
}