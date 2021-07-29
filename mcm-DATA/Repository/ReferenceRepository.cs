using mcm_DATA.Entities;
using mcm_DATA.Interface;
using mcm_DATA.Interface.Service;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace mcm_DATA.Repository
{
    public class ReferenceRepository : IReferenceRepository
    {
        private readonly IAdoProcedureRepository ado;
        private readonly IReferenceExtension refs;
        public ReferenceRepository(IAdoProcedureRepository ado, IReferenceExtension refs)
        {
            this.ado = ado;
            this.refs = refs;
        }

        public User GetCurrentUser(string currentUser)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("currentUser", currentUser));

            using (var ds = ado.FillData("usp_lib_user_level_info_get", param.ToArray()))
            {
                var user = new User();
                var rows = ds.Tables[0].Rows;
                if(rows.Count > 0)
                {
                    user.user_name = rows[0]["user_name"].ToString();
                    user.user_level = Convert.ToInt16(rows[0]["user_level"]);
                }
                else
                {
                    user.user_name = currentUser;
                    user.user_level = 0;
                }
                return user;
            }
        }

        public DataTable GetDiagnosis(string input)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@input", input == null ? "" : input));

            using (var ds = ado.FillData("usp_diagnosis_reference_get", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }
        public Reference GetReference()
        {
            var param = new List<SqlParameter>();
            using (var ds = ado.FillData("usp_reference_get", param.ToArray()))
            {
                return new Reference()
                {
                    medicine = refs.MedicineMapper(ds.Tables[0]),
                    supplier = refs.SupplierMapper(ds.Tables[1]),
                    reason = refs.ReasonMapper(ds.Tables[2]),
                    users = refs.UserMapper(ds.Tables[3]),
                };
            }
        }
    }
}
