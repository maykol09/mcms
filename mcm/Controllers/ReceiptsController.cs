using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Entities;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mcm.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptsController : Controller
    {
        private readonly IReceiptsRepository repo;
        public ReceiptsController(IReceiptsRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet("GetReceipts")]
        public JsonResult GetReceipts(string from, string to)
        {
            try
            {
                var result = repo.GetReceipts(from, to);
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
        [HttpPost("SaveReceipts")]
        public JsonResult SaveReceipts(MedicineReceipts data)
        {
            try
            {
                var result = repo.SaveReceipts(data);
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
        [HttpGet("GetStockMedicine")]
        public JsonResult GetStockMedicine(int si_id)
        {
            try
            {
                var result = repo.GetStockMedicine(si_id);
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
        [HttpPost("DeleteReceipts")]
        public JsonResult DeleteReceipts([FromBody] int si_id)
        {
            try
            {
                repo.DeleteReceipts(si_id);
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