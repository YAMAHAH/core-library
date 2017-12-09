using System;
using System.Collections.Generic;

namespace DataService.Models
{
    public class Report : EntityBase
    {
        public int ReportId { get; set; }
        public string ReportName { get; set; }
        public string Creator { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string Remark { get; set; }
        public bool IsReport { get; set; }
        public bool IsVirtualPart { get; set; }
        public bool IsLocal { get; set; }
        public byte[] ReportData { get; set; } = new byte[1];
        public Nullable<int> ParentId { get; set; }
        public Report Parent { get; set; }
        public int RootId { get; set; }
        public int Lft { get; set; }
        public int Rgt { get; set; }
        public int Level { get; set; }
        public int Ord { get; set; }
        public List<Report> Childs { get; set; } = new List<Report>();
    }
    public class ReportViewModel : EntityBase
    {
        public int ReportId { get; set; }
        public string ReportName { get; set; }
        public string Creator { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string Remark { get; set; }
        public bool IsReport { get; set; }
        public bool IsVirtualPart { get; set; }
        public bool IsLocal { get; set; }
        public byte[] ReportData { get; set; } = new byte[1];
        public Nullable<int> ParentId { get; set; }
        public Report Parent { get; set; }
        public int RootId { get; set; }
        public int Lft { get; set; }
        public int Rgt { get; set; }
        public int Level { get; set; }
        public int Ord { get; set; }
        public List<Report> Childs { get; set; } = new List<Report>();
    }
}