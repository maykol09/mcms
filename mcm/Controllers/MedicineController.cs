using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Entities;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mcm.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : Controller
    {
        private readonly IMedicineRepository repo;
        public MedicineController(IMedicineRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet("GetMedicines")]
        public JsonResult GetMedicines()
        {
            try
            {
                var result = repo.GetMedicines();
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
        [HttpPost("DeleteMedicine")]
        public JsonResult DeleteMedicine([FromBody] int med_id)
        {
            try
            {
                repo.DeleteMedicine(med_id);
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
        [HttpGet("GetMedicineDetails")]
        public JsonResult GetMedicineDetails(int med_id)
        {
            try
            {
                var result = repo.GetMedicineDetails(med_id);
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
        [HttpPost("SaveMedicineDetails")]
        public JsonResult SaveMedicineDetails(MedicineDetails data)
        {
            try
            {
                var result = repo.SaveMedicineDetails(data);
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
        [HttpGet("GetReceivedMed")]
        public JsonResult GetReceivedMed(int med_id)
        {
            try
            {
                var result = repo.GetReceivedMed(med_id);
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
        [HttpGet("GetIssuedMed")]
        public JsonResult GetIssuedMed(int med_id)
        {
            try
            {
                var result = repo.GetIssuedMed(med_id);
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
