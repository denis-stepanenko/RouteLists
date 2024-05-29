using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RouteListsAPI.Models;

namespace RouteListsAPI
{
    public class Seed
    {
        public static async Task SeedData(ApplicationContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new List<IdentityRole>
                {
                    new() { Name = "admin" },
                    new() { Name = "creator" },
                    new() { Name = "technologist" },
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }

            if (!userManager.Users.Any())
            {
                var user = new User { Name = "Степаненко Денис Олегович", Department = 77, UserName = "userasup20" };
                await userManager.CreateAsync(user, "m14780");

                foreach (var role in await roleManager.Roles.ToListAsync())
                {
                    await userManager.AddToRoleAsync(user, role.Name ?? "");
                }

                var user2 = new User { Name = "Иванов Иван Иванович", Department = 40, UserName = "IvanovII" };
                await userManager.CreateAsync(user2, "m14780");

                var creatorRole = await roleManager.FindByNameAsync("creator");

                await userManager.AddToRoleAsync(user2, creatorRole?.Name!);
            }
        }
    }
}