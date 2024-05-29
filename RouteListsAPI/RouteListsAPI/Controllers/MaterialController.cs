using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RouteListsAPI.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialController : ControllerBase
    {
        private readonly ApplicationContext _db;

        public MaterialController(ApplicationContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string filter = "")
        {
            var items = await _db.GetMaterialsAsync(filter);

            return Ok(items);
        }

        [HttpGet("GetByProduct")]
        public async Task<IActionResult> GetByProduct(string productCode)
        {
            var items = await _db.GetMaterialsByProductAsync(productCode);

            return Ok(items);
        }

        [HttpGet("GetByProductAndDepartment")]
        public async Task<IActionResult> GetByProductAndDepartment(string productCode, int department)
        {
            var items = await _db.GetMaterialsByProductAndDepartmentAsync(productCode, department);

            return Ok(items);
        }
    }
}