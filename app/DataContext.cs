using Microsoft.EntityFrameworkCore;
using MyContribution.Contacts;

namespace MyContribution
{
    //public class DbContextFactory : IDesignTimeDbContextFactory<DataContext>
    //{
    //    public DataContext CreateDbContext(string[] args)
    //    {
    //        IConfiguration config = Program.Configuration;
    //        string cs = config["ConnectionStrings:Default"];
    //        DbContextOptionsBuilder<DataContext> builder = new DbContextOptionsBuilder<DataContext>();
    //        builder.UseSqlServer(cs, options => options.MigrationsAssembly(typeof(Program).Assembly.FullName));
    //        return new DataContext(builder.Options);
    //    }
    //}

    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Offer_Field> Offer_Field { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Skill> Skills { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Offer_Field>().HasKey(v => new { v.FieldId, v.OfferId });
            modelBuilder.Entity<Offer_Skill>().HasKey(v => new { v.SkillId, v.OfferId });
        }
    }

}
