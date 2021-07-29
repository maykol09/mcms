using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Entities;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mcm.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ConsultationController : Controller
    {
        private readonly IConsultationRepository repo;
        
        public ConsultationController(IConsultationRepository repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetConsultation")]
        public JsonResult GetConsultation(int person_id)
        {
            try
            {
                var result = repo.GetConsultation(person_id);
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
        [HttpPost("SaveConsultation")]
        public JsonResult SaveConsultation(Consultation data)
        {
            try
            {
                var result = repo.SaveConsultation(data);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }
        [HttpPost("DeleteConsultation")]
        public JsonResult DeleteConsultation([FromBody] int[] consultation_ids)
        {
            try
            {
                repo.DeleteConsultation(consultation_ids);
                return new JsonResult(Ok());
            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [HttpGet("GetConsultationMed")]
        public JsonResult GetConsultationMed(int person_id, int consultation_id)
        {
            try
            {
                var result = repo.GetConsultationMed(person_id, consultation_id);
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
