using mcm_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace mcm_DATA.Repository
{
    public class MedicationRepository : IMedicationRepository
    {
        private readonly IAdoProcedureRepository ado;

        public MedicationRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }

        public DataTable GetMedication(int person_id)
        {
            var param = new List<SqlParameter>();

            param.Add(new SqlParameter("person_id", person_id));
            using(var ds = ado.FillData("usp_person_consult_medicine_list", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }
    }
}
