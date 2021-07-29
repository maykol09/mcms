using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mcm.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : Controller
    {
        private readonly IReportsRepository repo;
        public ReportsController(IReportsRepository repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetConsultationReports")]
        public JsonResult GetConsultationReports(string from, string to)
        {
            try
            {
                var result = repo.GetConsultationReports(from, to);
                return new JsonResult(result);

            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [HttpGet("GetMedicationReports")]
        public JsonResult GetMedicationReports(string from, string to)
        {
            try
            {
                var result = repo.GetMedicationReports(from, to);
                return new JsonResult(result);

            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [HttpGet("GetMedicineReports")]
        public JsonResult GetMedicineReports()
        {
            try
            {
                var result = repo.GetMedicineReports();
                return new JsonResult(result);

            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}
