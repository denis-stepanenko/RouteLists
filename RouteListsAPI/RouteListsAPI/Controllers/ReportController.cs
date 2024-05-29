using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Microsoft.Reporting.NETCore;
using PdfSharp.Pdf.IO;
using RouteListsAPI.Models;

namespace RouteListsAPI.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationContext _db;
        private readonly IWebHostEnvironment _environment;

        public ReportController(ApplicationContext db, IWebHostEnvironment environment)
        {
            _db = db;
            _environment = environment;
        }

        [HttpGet]
        [Route("GetRouteListForIVUKReport")]
        public async Task<IActionResult> GetRouteListForIVUKReport(int id, string format)
        {
            if(!new[] {"pdf", "docx", "xlsx"}.Contains(format))
                return BadRequest("Неверный формат файла");

            var routeList = await _db.RouteLists.FindAsync(id);
            var operations = await _db.RouteListOperations.Where(x => x.RouteListId == id).ToListAsync();
            var routeListFramelessComponents = await _db.RouteListFramelessComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListReplacedComponents = await _db.RouteListReplacedComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListDocuments = await _db.RouteListDocuments.Where(x => x.RouteListId == id).ToListAsync();
            var routeListRepairs = await _db.RouteListRepairs.Where(x => x.RouteListId == id).ToListAsync();
            var routeListComponents = await _db.RouteListComponents.Where(x => x.RouteListId == id).ToListAsync();

            if (routeList is null)
                return NotFound();

            string path = Path.Combine(_environment.ContentRootPath, "Reports\\RouteListForIVUK.rdlc");

            using TextReader stream = System.IO.File.OpenText(path);
            using var report = new LocalReport();
            report.LoadReportDefinition(stream);

            routeList.ESDProtectionRequired = routeList.ESDProtectionRequired;

            report.DataSources.Add(new ReportDataSource("Card", new List<RouteList> { routeList }));
            report.DataSources.Add(new ReportDataSource("CardFramelessComponents", routeListFramelessComponents));
            report.DataSources.Add(new ReportDataSource("CardComponents", routeListComponents));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart1", operations));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart2", operations));
            report.DataSources.Add(new ReportDataSource("CardDocuments", routeListDocuments));
            report.DataSources.Add(new ReportDataSource("CardRepairs", routeListRepairs));
            report.DataSources.Add(new ReportDataSource("CardReplacedComponents", routeListReplacedComponents));

            var file = GetFile(report, format, "Маршрутный лист на ИВУК " + routeList.Number);

            if (file == null)
                return BadRequest();

            return file;
        }

        [HttpGet]
        [Route("GetAnnex1Report")]
        public async Task<IActionResult> GetAnnex1Report(int id, string format)
        {
            if(!new[] {"pdf", "docx", "xlsx"}.Contains(format))
                return BadRequest("Неверный формат файла");

            var routeList = await _db.RouteLists.FindAsync(id);
            var routeListOperations = await _db.RouteListOperations.Where(x => x.RouteListId == id).ToListAsync();

            if (routeList is null)
                return NotFound();

            string path = Path.Combine(_environment.ContentRootPath, "Reports\\Annex1Report.rdlc");

            using TextReader stream = System.IO.File.OpenText(path);
            using var report = new LocalReport();
            report.LoadReportDefinition(stream);

            report.DataSources.Add(new ReportDataSource("Card", new List<RouteList> { routeList }));
            report.DataSources.Add(new ReportDataSource("Operations", routeListOperations));

            var file = GetFile(report, format, "Маршрутный лист на детали (Приложение 1) " + routeList.Number);

            if (file == null)
                return BadRequest();

            return file;
        }

        [HttpGet]
        [Route("GetAnnex2Report")]
        public async Task<IActionResult> GetAnnex2Report(int id, string format)
        {
            if(!new[] {"pdf", "docx", "xlsx"}.Contains(format))
                return BadRequest("Неверный формат файла");

            var routeList = await _db.RouteLists.FindAsync(id);
            var operations = await _db.RouteListOperations.Where(x => x.RouteListId == id).ToListAsync();
            var routeListFramelessComponents = await _db.RouteListFramelessComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListReplacedComponents = await _db.RouteListReplacedComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListDocuments = await _db.RouteListDocuments.Where(x => x.RouteListId == id).ToListAsync();
            var routeListRepairs = await _db.RouteListRepairs.Where(x => x.RouteListId == id).ToListAsync();
            var routeListComponents = await _db.RouteListComponents.Where(x => x.RouteListId == id).ToListAsync();

            if (routeList is null)
                return NotFound();

            string path = Path.Combine(_environment.ContentRootPath, "Reports\\Annex2Report.rdlc");

            using TextReader stream = System.IO.File.OpenText(path);
            using var report = new LocalReport();
            report.LoadReportDefinition(stream);

            report.DataSources.Add(new ReportDataSource("Card", new List<RouteList> { routeList }));
            report.DataSources.Add(new ReportDataSource("CardFramelessComponents", routeListFramelessComponents));
            report.DataSources.Add(new ReportDataSource("CardComponents", routeListComponents));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart1", operations));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart2", operations));
            report.DataSources.Add(new ReportDataSource("CardDocuments", routeListDocuments));
            report.DataSources.Add(new ReportDataSource("CardRepairs", routeListRepairs));
            report.DataSources.Add(new ReportDataSource("CardReplacedComponents", routeListReplacedComponents));

            var file = GetFile(report, format, "Маршрутный лист на детали (Приложение 2) " + routeList.Number);

            if (file == null)
                return BadRequest();

            return file;
        }

        [HttpGet]
        [Route("GetAnnex3Report")]
        public async Task<IActionResult> GetAnnex3Report(int id, string format)
        {
            if(!new[] {"pdf", "docx", "xlsx"}.Contains(format))
                return BadRequest("Неверный формат файла");

            var routeList = await _db.RouteLists.FindAsync(id);
            var operations = await _db.RouteListOperations.Where(x => x.RouteListId == id).ToListAsync();
            var routeListFramelessComponents = await _db.RouteListFramelessComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListReplacedComponents = await _db.RouteListReplacedComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListDocuments = await _db.RouteListDocuments.Where(x => x.RouteListId == id).ToListAsync();
            var routeListRepairs = await _db.RouteListRepairs.Where(x => x.RouteListId == id).ToListAsync();
            var routeListComponents = await _db.RouteListComponents.Where(x => x.RouteListId == id).ToListAsync();

            if (routeList is null)
                return NotFound();

            string path = Path.Combine(_environment.ContentRootPath, "Reports\\Annex3Report.rdlc");

            using TextReader stream = System.IO.File.OpenText(path);
            using var report = new LocalReport();
            report.LoadReportDefinition(stream);

            report.DataSources.Add(new ReportDataSource("Card", new List<RouteList> { routeList }));
            report.DataSources.Add(new ReportDataSource("CardFramelessComponents", routeListFramelessComponents));
            report.DataSources.Add(new ReportDataSource("CardComponents", routeListComponents));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart1", operations));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart2", operations));
            report.DataSources.Add(new ReportDataSource("CardDocuments", routeListDocuments));
            report.DataSources.Add(new ReportDataSource("CardRepairs", routeListRepairs));
            report.DataSources.Add(new ReportDataSource("CardReplacedComponents", routeListReplacedComponents));

            var file = GetFile(report, format, "Маршрутный лист на детали (Приложение 3) " + routeList.Number);

            if (file == null)
                return BadRequest();

            return file;
        }

        [HttpGet]
        [Route("GetAnnex5Report")]
        public async Task<IActionResult> GetAnnex5Report(int id, string format)
        {
            if(!new[] {"pdf", "docx", "xlsx"}.Contains(format))
                return BadRequest("Неверный формат файла");

            var routeList = await _db.RouteLists.FindAsync(id);
            var operations = await _db.RouteListOperations.Where(x => x.RouteListId == id).ToListAsync();
            var routeListFramelessComponents = await _db.RouteListFramelessComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListReplacedComponents = await _db.RouteListReplacedComponents.Where(x => x.RouteListId == id).ToListAsync();
            var routeListDocuments = await _db.RouteListDocuments.Where(x => x.RouteListId == id).ToListAsync();
            var routeListRepairs = await _db.RouteListRepairs.Where(x => x.RouteListId == id).ToListAsync();
            var routeListComponents = await _db.RouteListComponents.Where(x => x.RouteListId == id).ToListAsync();

            if (routeList is null)
                return NotFound();

            string path = Path.Combine(_environment.ContentRootPath, "Reports\\Annex5Report.rdlc");

            using TextReader stream = System.IO.File.OpenText(path);
            using var report = new LocalReport();
            report.LoadReportDefinition(stream);

            report.DataSources.Add(new ReportDataSource("Card", new List<RouteList> { routeList }));
            report.DataSources.Add(new ReportDataSource("CardFramelessComponents", routeListFramelessComponents));
            report.DataSources.Add(new ReportDataSource("CardComponents", routeListComponents));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart1", operations));
            report.DataSources.Add(new ReportDataSource("CardOperationsPart2", operations));
            report.DataSources.Add(new ReportDataSource("CardDocuments", routeListDocuments));
            report.DataSources.Add(new ReportDataSource("CardRepairs", routeListRepairs));
            report.DataSources.Add(new ReportDataSource("CardReplacedComponents", routeListReplacedComponents));

            var file = GetFile(report, format, "Маршрутный лист на детали (Приложение 5) " + routeList.Number);

            if (file == null)
                return BadRequest();

            return file;
        }

        private FileContentResult? GetFile(LocalReport report, string format, string name)
        {
            switch (format)
            {
                case "pdf":
                        var contentDisposition = new ContentDisposition
                        {
                            FileName = Uri.EscapeDataString(name + ".pdf"),
                            Inline = true
                        };

                        Response.Headers.Append(HeaderNames.ContentDisposition, contentDisposition.ToString());

                        var bytes = AddTitleMetadataToPDFFile(report.Render("PDF"), name);

                        return File(bytes, "application/pdf");

                case "docx":
                    return File(report.Render("WORDOPENXML"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name + ".docx");

                case "xlsx":
                    return File(report.Render("EXCELOPENXML"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name + ".xlsx");

                default: 
                    return null;
            }
        }

        private byte[] AddTitleMetadataToPDFFile(byte[] file, string title)
        {
            using var inputStream = new MemoryStream(file);
            using var outputStream = new MemoryStream();

            var document = PdfReader.Open(inputStream);
            document.Info.Title = title;
            document.Save(outputStream, false);
            return outputStream.ToArray();
        }
    }
}