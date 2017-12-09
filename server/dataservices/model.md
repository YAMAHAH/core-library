1.替换键<AlternateKey>只能用Fluent API定义

    表示除了主键外定义实体的唯一性，确保完整性和一致性
    modelBuilder.Entity<Car>()
        .HasAlternateKey(c => c.LicensePlate);
2.
<primary key property name>, //blogid
<navigation property name><primary key property name>,//myblogblogid
or
<principalentity name><primary key property name> //blogblogid

如果没有指定外键，那么会自动生成外键值
<navigationproperty name><principal key property name>

3.Including & Excluding Types(包括或排除类型)
 
  3.1 约定包含类型  DbSet navigation property  modelBuilder.Entity<AuditEntry>();
  
  3.2 Data Annotations排除类型  [NotMapped]

  3.3 Fluent API方式排除类型 modelBuilder.Ignore<BlogMetadata>();

4.Including & Excluding Properties(包含排除属性)

    4.1 约定  public get;set; 属性

    4.2 Data Annotations排除属性  [NotMapped]

    4.3 Fluent API方式排除属性 modelBuilder.Entity<Blog>().Ignore(b => b.LoadedFromDatabase);