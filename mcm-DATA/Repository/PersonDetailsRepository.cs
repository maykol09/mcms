using mcm_DATA.Entities;
using mcm_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace mcm_DATA.Repository
{
    public class PersonDetailsRepository : IPersonDetailsRepository
    {
        private readonly IAdoProcedureRepository ado;

        public PersonDetailsRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }
        public DataTable GetPersonDetails(int  person_id)
        {
            var param = new List<SqlParameter>();

            param.Add(new SqlParameter("person_id", person_id));
            using (var ds = ado.FillData("usp_person_details_get", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }
        public int SavePersonDetails(PersonDetails data)
        {
            var param = new List<SqlParameter>();

            param.Add(new SqlParameter("@person_id", data.person_id));
           
            param.Add(new SqlParameter("@last_name", data.last_name));
            param.Add(new SqlParameter("@first_name", data.first_name));
            param.Add(new SqlParameter("@middle_name", nullToDbNull(data.middle_name)));
            param.Add(new SqlParameter("@birth_date", Convert.ToDateTime(data.birth_date)));
            param.Add(new SqlParameter("@sub_unit_code", nullToDbNull(data.sub_unit_code)));
            param.Add(new SqlParameter("@file_no", intNull(data.sfile_no)));
            param.Add(new SqlParameter("@allergy", nullToDbNull(data.allergy)));
            param.Add(new SqlParameter("@category", nullToDbNull(data.sis_employee_type)));
            param.Add(new SqlParameter("@user", "ogdocm"));

            if(data.action == "I")
            {
                param.Add(new SqlParameter("@sis_person_id", intNull(data.sis_person_id)));
                using (var ds = ado.FillData("usp_person_details_ins", param.ToArray()))
                {
                    return Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                }
            }
            else
            {
                ado.ExecuteNonQuery("usp_person_details_upd", param.ToArray());
                return data.person_id;
            }
        }
        public PersonDetails GetPersonDetailsById(int person_id)
        {
            var param = new List<SqlParameter>();
            var person = new PersonDetails();
            param.Add(new SqlParameter("@person_id", person_id));
            using (var ds = ado.FillData("usp_person_details_getById", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach(DataRow row in rows)
                {
                    person.first_name = row["first_name"].ToString();
                    person.last_name = row["last_name"].ToString();
                    person.middle_name = row["middle_name"].ToString();
                    person.birth_date = row["birth_date"].ToString() == DBNull.Value.ToString() ? (DateTime?)null : Convert.ToDateTime(row["birth_date"]);
                    person.sub_unit_code = row["unit_code"].ToString();
                    person.sis_employee_type = row["employee_type"].ToString();
                    person.sis_person_id = Convert.ToInt32(row["person_id"]);
                }
                return person; 
            }
        }
        private int intNull(int? data)
        {
            return data == null ? 0 : Convert.ToInt32(data);
        }
        private string nullToDbNull(string data)
        {
            return data == null ? DBNull.Value.ToString() : data;
        }
    }
}
