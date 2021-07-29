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
    [Authorize]
    public class PersonDetailsController : Controller
    {
        private readonly IPersonDetailsRepository repo;

        public PersonDetailsController(IPersonDetailsRepository repo)
        {
            this.repo = repo;
        }
        [Authorize]
        [HttpGet("GetPersonDetails")]
        public JsonResult GetPersonDetails(int person_id)
        {
            try
            {
                var result = repo.GetPersonDetails(person_id);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data);
            }
        }
        [HttpPost("SavePersonDetails")]
        public JsonResult SavePersonDetails(PersonDetails data)
        {
            try
            {
                var result = repo.SavePersonDetails(data);
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
        [HttpGet("GetPersonDetailsById")]
        public JsonResult GetPersonDetailsById(int person_id)
        {
            try
            {
                var result = repo.GetPersonDetailsById(person_id);
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Data);
            }
        }
    }
}
