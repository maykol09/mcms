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
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class MedicalController : Controller
    {
        private readonly IMedicalRepository repo;
        public MedicalController(IMedicalRepository repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetMedical")]
        public JsonResult GetMedical(int person_id)
        {
            try
            {
                var result = repo.GetMedical(person_id);
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
