using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Entities;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mcm.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : Controller
    {
        private readonly IMaintenanceRepository repo;
        public MaintenanceController(IMaintenanceRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet("GetUser")]
        public JsonResult GetUser()
        {
            try
            {
                var result = repo.GetUser();
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
        [HttpPost("SaveUser")]
        public JsonResult SaveUser([FromBody] List<UserAccess> data)
        {
            try
            {
                 repo.SaveUser(data);
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
        [HttpPost("DeleteUser")]
        public JsonResult DeleteUser([FromBody] int user_id)
        {
            try
            {
                repo.DeleteUser(user_id);
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
        [HttpGet("GetReference")]
        public JsonResult GetReference()
        {
            try
            {
                var result = repo.GetReference();
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
        [HttpPost("SaveReference")]
        public JsonResult SaveReference([FromBody] List<LibReference> data)
        {
            try
            {
                repo.SaveReference(data);
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
        [HttpPost("DeleteReference")]
        public JsonResult DeleteReference(int ref_id)
        {
            try
            {

                repo.DeleteReference(ref_id);
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
    }
}