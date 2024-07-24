using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mcm_DATA.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace mcm.Controllers
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class ReferenceController : Controller
    {
        private IHttpContextAccessor httpContext;
        private IReferenceRepository repo;

        public ReferenceController(IHttpContextAccessor httpContextAccessor, IReferenceRepository repo)
        {
            if (httpContext == null)
            {
                httpContext = httpContextAccessor;
            }
            this.repo = repo;
        }

        private string currentUsername
        {
            get
            {
                string userName = httpContext.HttpContext.User.Identity.Name;
                if (userName != null)
                {
                    return System.IO.Path.GetFileNameWithoutExtension(userName);
                }
                return null;
            }
        }
        [Authorize]
        [HttpGet("GetCurrentUser")]
        public JsonResult GetCurrentUser()
        {
            try
            {
                if (currentUsername == null)
                {
                    return new JsonResult("no username");
                }
                var result = repo.GetCurrentUser(currentUsername);
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
        [HttpGet("GetDiagnosis")]
        public JsonResult GetDiagnosis(string input)
        {
            try
            {
                var result = repo.GetDiagnosis(input);
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
        [Authorize]
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
                return new JsonResult(ex);
            }

        }
    }
}
