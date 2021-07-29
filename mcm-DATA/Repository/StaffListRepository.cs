using mcm_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace mcm_DATA.Repository
{
    public class StaffListRepository: IStaffListRepository
    {
        private readonly IAdoProcedureRepository adoProcedureRepository;

        public StaffListRepository(IAdoProcedureRepository adoProcedureRepository)
        {
            this.adoProcedureRepository = adoProcedureRepository;
        }

        public DataTable GetStaffList(string staff)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@name", staff));
            using (var ds = adoProcedureRepository.FillData("usp_person_consult_list", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }
        public void DeleteStaff(int person_id)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@person_id", person_id));
            adoProcedureRepository.ExecuteNonQuery("usp_person_consultation_del", param.ToArray());
           
        }
    }
}
