using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataService.Models
{
    public class Blog:EntityBase
    {
        public Blog ()
        {
          this.Posts = new List<Post>();
        }

        public int BlogId { get; set; }
        public string Url { get; set; }

        public string BlogName { get; set; }

        public List<Post> Posts { get; set; }
        [NotMapped]
        public string SiteName { get; set; }
    }

    public class Post:EntityBase
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }

    public abstract class EntityBase
    {
        // //   public delegate void TextChangeHandler(object sender, EventArgs e);
        // public event PropertyChangedEventHandler PropertyChanged;
        // protected void OnNotifyPropertyChanged([CallerMemberName] string propertyName = "")
        // {
        //     // IsModified = true;
        //     if (PropertyChanged != null)
        //     {
        //         PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        //     }
        // }

        // protected void SetPropValue(object oldObject, object newObject)
        // {
        //     if (oldObject != newObject)
        //     {
        //         oldObject = newObject;
        //         OnNotifyPropertyChanged();
        //     }
        // }

        //[NotMapped]
        //public bool IsModified { get; set; }
    }

    public class Test
    {
        private string myVar = "abc";

        public string MyVar
        {
            get { return myVar; }
            set { myVar = value; }
        }

        public List<string> Strs { get; set; }

        public Test()
        {
            Strs = new List<string>();
            Strs.Add(myVar);
        }
        public Test(string str) : this()
        {
            myVar = str;
        }
    }
}
