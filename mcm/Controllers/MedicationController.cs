using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mcm.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
  
    public class MedicationController : Controller
    {
        private readonly IMedicationRepository repo;

        public MedicationController(IMedicationRepository repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetMedication")]
        public JsonResult GetMedication(int person_id)
        {
            try
            {
                var result = repo.GetMedication(person_id);
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
