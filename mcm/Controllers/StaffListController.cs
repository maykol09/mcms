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
    [ApiController]
    [AllowAnonymous]
    public class StaffListController : Controller
    {
        private readonly IStaffListRepository IStaffList;

        public StaffListController(IStaffListRepository IStaffList)
        {
            this.IStaffList = IStaffList;

        }

        [HttpGet("GetStaffList")]
        public JsonResult GetStaffList(string staff)
        {
            try
            {
                var result = IStaffList.GetStaffList(staff);
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
        [HttpPost("DeleteStaff")]
        public JsonResult DeleteStaff([FromBody] int person_id)
        {
            try
            {
                IStaffList.DeleteStaff(person_id);
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
