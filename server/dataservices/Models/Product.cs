using System;
using System.Collections.Generic;

namespace DataService.Models
{
    public class Product : EntityBase
    {
        public int ProductId { get; set; }
        public string ProductNo { get; set; }
        public string ProductName { get; set; }
        public string ProductDesc { get; set; }
        public string Dw { get; set; }
        public List<ProductVersion> ProductVersions { get; set; } = new List<ProductVersion>();
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }

    }
    public class ProductViewModel : EntityBase
    {
        public int ProductId { get; set; }
        public string ProductNo { get; set; }
        public string ProductName { get; set; }
        public string ProductDesc { get; set; }
        public string Dw { get; set; }
        public List<ProductVersion> ProductVersions { get; set; } = new List<ProductVersion>();
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }

    }

    public class ProductVersion : EntityBase
    {
        //一个产品版次需要一个产品,有零个或一个产品层结构

        public int ProductVersionId { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string Version { get; set; } = "A0";
        public DateTime VersionDate { get; set; }
        public List<BomStructure> RootRefs { get; set; } = new List<BomStructure>();
        public List<BomStructure> NodeRefs { get; set; } = new List<BomStructure>();

    }

    public class ProductVersionViewModel : EntityBase
    {
        //一个产品版次需要一个产品,有零个或一个产品层结构

        public int ProductVersionId { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string Version { get; set; } = "A0";
        public DateTime VersionDate { get; set; }
        public List<BomStructure> RootRefs { get; set; } = new List<BomStructure>();
        public List<BomStructure> NodeRefs { get; set; } = new List<BomStructure>();

    }

    public class BomStructure : EntityBase
    {
        //一个产品结构必须一个版次,一个结构有零或多个自身结点
        public int BomStructureId { get; set; }
        public int RootId { get; set; }
        public int Ord { get; set; }
        public int Level { get; set; }
        public double SingleTotal { get; set; }
        public double Total { get; set; } = 1;
        public double Cost { get; set; }
        public decimal NeedTotal { get; set; }
        public decimal MaoTotal { get; set; }
        public Decimal MrpTotal { get; set; }
        public decimal UsedKc { get; set; }
        public int Lft { get; set; }
        public int Rgt { get; set; }
        public bool IsVirtualPart { get; set; }
        public Nullable<int> ParentId { get; set; }
        public BomStructure Parent { get; set; }
        public List<BomStructure> Childs { get; set; } = new List<BomStructure>();
        public int NodeVersionId { get; set; }
        public ProductVersion NodeVersion { get; set; }
        public int RootVersionId { get; set; }
        public ProductVersion RootVersion { get; set; }
    }

    public class BomNodeViewModel : EntityBase
    {
        //一个产品结构必须一个版次,一个结构有零或多个自身结点
        public int BomStructureId { get; set; }
        public int RootId { get; set; }
        public int Ord { get; set; }
        public int Level { get; set; }
        public double SingleTotal { get; set; }
        public double Total { get; set; }
        public int Lft { get; set; }
        public int Rgt { get; set; }
        public bool IsVirtualPart { get; set; }
        public Nullable<int> ParentId { get; set; }
        public BomStructure Parent { get; set; }
        public List<BomStructure> Childs { get; set; } = new List<BomStructure>();
        public int NodeVersionId { get; set; }
        public ProductVersion NodeVersion { get; set; }
        public int RootVersionId { get; set; }
        public ProductVersion RootVersion { get; set; }
    }
}