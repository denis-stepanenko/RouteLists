using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.Models;

namespace RouteListsAPI
{
    public class ApplicationContext : IdentityDbContext<User>
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("RouteListsUsers");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("RouteListsUserClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("RouteListsUserLogins");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("RouteListsUserTokens");
            modelBuilder.Entity<IdentityRole>().ToTable("RouteListsRoles");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RouteListsRoleClaims");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("RouteListsUserRoles");

            modelBuilder.Entity<RouteList>().ToTable("RCCards", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<Executor>().ToTable("RCExecutors", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<Operation>().ToTable("RCOperations", t => t.ExcludeFromMigrations());

            modelBuilder.Entity<RouteListDocument>()
                .ToTable("RCCardDocuments", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<RouteListOperation>(eb =>
            {
                eb.ToTable("RCCardOperations", t => t.ExcludeFromMigrations());
                eb.Property(x => x.RouteListId).HasColumnName("CardId");
                eb.Property(x => x.Labor).HasPrecision(18, 3);
            });

            modelBuilder.Entity<RouteListModification>()
                .ToTable("RCCardModifications", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<RouteListFramelessComponent>()
                .ToTable("RCCardFramelessComponents", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<RouteListRepair>()
                .ToTable("RCCardRepairs", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<RouteListReplacedComponent>()
                .ToTable("RCCardReplacedComponents", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<RouteListComponent>()
                .ToTable("RCCardComponents", t => t.ExcludeFromMigrations())
                .Property(x => x.RouteListId).HasColumnName("CardId");

            modelBuilder.Entity<TechProcess>().ToTable("RCTechProcesses", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<TechProcessDocument>().ToTable("RCTechProcessDocuments", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<TechProcessOperation>().ToTable("RCTechProcessOperations", t => t.ExcludeFromMigrations());
            
            modelBuilder.Entity<TechProcessPurchasedProduct>(eb => 
            {
                eb.ToTable("RCTechProcessPurchasedProducts", t => t.ExcludeFromMigrations());
                eb.Property(x => x.Count).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Material>()
                .ToTable("tMaterial", t => t.ExcludeFromMigrations())
                .ToTable(x => x.HasTrigger("tr_tmaterial_d"))
                .ToTable(x => x.HasTrigger("tr_tmaterial_i"))
                .ToTable(x => x.HasTrigger("tr_tmaterial_u"));

            modelBuilder.Entity<Relation>(eb => 
            {
                eb.ToTable(nameof(Relation), t => t.ExcludeFromMigrations());
                eb.HasNoKey();
                eb.Property(x => x.Count).HasPrecision(18, 3);
                eb.Property(x => x.CountAll).HasPrecision(18, 3);
                eb.Property(x => x.TechWaste).HasPrecision(18, 3);
                eb.Property(x => x.CountAllWithoutWaste).HasPrecision(18, 3);

            });

            modelBuilder.Entity<Order>()
                .ToTable(nameof(Order), t => t.ExcludeFromMigrations())
                .HasNoKey();

            modelBuilder.Entity<OwnProduct>()
                .ToTable("ref_dse", t => t.ExcludeFromMigrations())
                .Property(x => x.Code).HasColumnName("Decnum");

            modelBuilder.Entity<PurchasedProduct>()
                .ToTable("ref_purchase", t => t.ExcludeFromMigrations())
                .Property(x => x.Code).HasColumnName("Decnum");

            modelBuilder.Entity<PickingListProduct>(eb => 
            {
                eb.ToTable(nameof(PickingListProduct), t => t.ExcludeFromMigrations());
                eb.HasNoKey();
                eb.Property(x => x.Count).HasPrecision(18, 3);
            });
                
        }

        public DbSet<RouteList> RouteLists { get; set; }
        public DbSet<Executor> Executors { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<RouteListDocument> RouteListDocuments { get; set; }
        public DbSet<RouteListOperation> RouteListOperations { get; set; }
        public DbSet<RouteListModification> RouteListModifications { get; set; }
        public DbSet<RouteListFramelessComponent> RouteListFramelessComponents { get; set; }
        public DbSet<RouteListRepair> RouteListRepairs { get; set; }
        public DbSet<RouteListReplacedComponent> RouteListReplacedComponents { get; set; }
        public DbSet<RouteListComponent> RouteListComponents { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Relation> Relations { get; set; }
        public DbSet<TechProcess> TechProcesses { get; set; }
        public DbSet<TechProcessDocument> TechProcessDocuments { get; set; }
        public DbSet<TechProcessOperation> TechProcessOperations { get; set; }
        public DbSet<TechProcessPurchasedProduct> TechProcessPurchasedProducts { get; set; }

        public DbSet<OwnProduct> OwnProducts { get; set; }
        public DbSet<PurchasedProduct> PurchasedProducts { get; set; }
        public DbSet<PickingListProduct> PickingListProducts { get; set; }

        public Task<List<Material>> GetMaterialsAsync(string filter)
            => Materials.FromSql(
$@"select top 50 
MaterialId Id, Code, Name, Size + ' ' + Type Parameter
from tMaterial
where 
Code like '%' + {filter} + '%'
or Name like '%' + {filter} + '%'
or Size + ' ' + Type like '%' + {filter} + '%'")
            .AsNoTracking()
            .ToListAsync();

        public Task<List<Material>> GetMaterialsByProductAsync(string code)
            => Materials.FromSql(
$@"declare @Id int = (select AssemblyUnitId from tAssemblyUnit where Code = {code})

select 
aum.AssemblyUnitId Id, 
m.Code, 
m.Name,
ISNULL(m.Size, '') + ISNULL(m.[Type], '') Parameter
from tAssemblyUnitMaterial aum 
left join tMaterial m on m.MaterialId = aum.MaterialId
join tUnit u on u.UnitId = m.UnitId
where 
aum.AssemblyUnitId = @Id")
            .AsNoTracking()
            .ToListAsync();

        public Task<List<Material>> GetMaterialsByProductAndDepartmentAsync(string code, int department)
            => Materials.FromSql(
$@"declare @Id int = (select AssemblyUnitId from tAssemblyUnit where Code = {code})

select 
aum.AssemblyUnitId Id, 
m.Code, 
m.Name,
ISNULL(m.Size, '') + ISNULL(m.[Type], '') Parameter
from tAssemblyUnitMaterial aum 
left join tMaterial m on m.MaterialId = aum.MaterialId
join tUnit u on u.UnitId = m.UnitId
where 
aum.AssemblyUnitId = @Id
and aum.Department = {department}")
            .AsNoTracking()
            .ToListAsync();

        public Task<List<Order>> GetOrdersAsync(string productCode)
            => Orders.FromSql($"GetDirections {productCode}")
                    .AsNoTracking()
                    .ToListAsync();

        public async Task<string?> GetProductRouteAsync(int productId, int tableId)
        {
            string tm = int.Parse(DateTime.Now.ToString("HHmmssfff")).ToString();

            using var tran = Database.BeginTransaction();

            await Database.ExecuteSqlAsync($"exec c_SelTask @Tm = {tm}");

            await Database.ExecuteSqlAsync($"exec i_TaskComp @IdDse = {productId}, @CountDse = 1, @IdOrder = 0, @Reference = 1, @TableWhat = {tableId}, @Tm = {tm}");

            await Database.ExecuteSqlAsync($"exec i_CompoundTaskDevelopmentWithTypeIn @IdentOpen = 1, @Tm = {tm}");

            var result = await Relations.FromSql($"exec EVPR_sCompoundForDeptsWithTypeIn3 @IdentPurchase = 0, @Tm = {tm}")
                .AsNoTracking()
                .ToListAsync();

            tran.Commit();

            string? route = result.Where(x => string.IsNullOrEmpty(x.ParentCode))
                .Select(x => x.Route)
                .FirstOrDefault()
                ?.Replace("  ", " ");

            return route;
        }

        public async Task<string?> GetProductRouteAsync(string productCode)
        {
            int? purchasedProductId = Database.SqlQuery<int?>($"select Id from ref_purchase where Decnum = {productCode}").ToList().FirstOrDefault();
            int? ownProductId = Database.SqlQuery<int?>($"select Id from ref_dse where Decnum = {productCode}").ToList().FirstOrDefault();

            if (purchasedProductId != null)
            {
                return await GetProductRouteAsync((int)purchasedProductId, 1);
            }

            if (ownProductId != null)
            {
                return await GetProductRouteAsync((int)ownProductId, 2);
            }

            return null;
        }

        public async Task<List<PickingListProduct>> GetPickingListAsync(string productCode, int count)
        {
            int? productId = Database.SqlQuery<int?>($"select Id from ref_dse where Decnum = {productCode}").ToList().FirstOrDefault();

            string tm = int.Parse(DateTime.Now.ToString("HHmmssfff")).ToString();

            using var tran = Database.BeginTransaction();

            await Database.ExecuteSqlAsync($"exec c_SelTask @Tm = {tm}");

            await Database.ExecuteSqlAsync($"exec i_TaskComp @IdDse = {productId}, @CountDse = {count}, @IdOrder = 0, @Reference = 1, @TableWhat = 2, @Tm = {tm}");

            await Database.ExecuteSqlAsync($"exec i_CompoundTaskDevelopmentWithTypeIn @IdentOpen = 0, @Tm = {tm}");

            var result = new List<PickingListProduct>();

            var products = await PickingListProducts.FromSql($"exec EVPR_sDeliveryList @Type = 0, @Count = {count}, @Tm = {tm}")
                .AsNoTracking()
                .ToListAsync();

            result.AddRange(products);

            var products2 = await PickingListProducts.FromSql($"exec EVPR_sDeliveryList @Type = 1, @Count = {count}, @Tm = {tm}")
                .AsNoTracking()
                .ToListAsync();

            result.AddRange(products2);

            tran.Commit();

            return result;
        }

        public async Task<int?> GetNewRouteListNumberAsync(int department)
        {
            var result = await Database.SqlQuery<int?>(
            @$"select isnull(max((case when isnumeric(Number) = 1 then convert(int, Number) else 0 end)), 0) + 1 Number from RCCards
            where Department = {department}")
            .ToListAsync();

            return result.FirstOrDefault();
        }
    }
}