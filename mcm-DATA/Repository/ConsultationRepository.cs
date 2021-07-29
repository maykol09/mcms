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
    public class ConsultationRepository : IConsultationRepository
    {
        private readonly IAdoProcedureRepository ado;
        public ConsultationRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }

        public DataTable GetConsultation(int person_id)
        {
            var param = new List<SqlParameter>();

            param.Add(new SqlParameter("person_id", person_id));
            using (var ds = ado.FillData("usp_person_consult_get", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }

        public int SaveConsultation(Consultation data)
        {
            var param = new List<SqlParameter>();

            param.Add(new SqlParameter("@person_id", data.person_id));
            param.Add(new SqlParameter("@complaints", data.complaints));
            param.Add(new SqlParameter("@diagnosis", data.diagnosis));
            param.Add(new SqlParameter("@treatment", data.treatment));
            param.Add(new SqlParameter("@date_consulted", data.date_consulted));
            param.Add(new SqlParameter("@consulted_by", data.consulted_by));
            param.Add(new SqlParameter("@user_name", data.consulted_by));
            
            if (data.action == "I")
            {
                using (var ds = ado.FillData("usp_person_consult_details_ins", param.ToArray()))
                {
                    var consultation_id = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                    SaveMedicine(data.medicine, consultation_id, data.person_id);
                    return consultation_id;
                }
            }
            else
            {
                param.Add(new SqlParameter("@consult_id", data.consultation_id));
                ado.ExecuteNonQuery("usp_person_consult_details_upd", param.ToArray());
                SaveMedicine(data.medicine, data.consultation_id, data.person_id);
                return data.consultation_id;
            }

        }
        public void SaveMedicine(List<Medication> data, int consultation_id, int person_id)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@consultation_id", consultation_id));
            param.Add(new SqlParameter("@person_id", person_id));
            string uspText = "usp_medicine_save";
            
            ado.BatchBulkSave(uspText, createMedicineDataTable(data), "##medicine", createMedicineTempTable("##medicine"), param.ToArray());
        }
        public DataTable createMedicineDataTable(List<Medication> data)
        {
            var dt = new DataTable();
            dt.Columns.Add("med_id");
            dt.Columns.Add("consult_med_id");
            dt.Columns.Add("medicine");
            dt.Columns.Add("dosage");
            dt.Columns.Add("quantity");
            dt.Columns.Add("action");
            foreach (var d in data)
            {
                var row = dt.NewRow();
                row["med_id"] = d.med_id;
                row["consult_med_id"] = d.consult_med_id;
                row["medicine"] = d.medicine;
                row["dosage"] = d.dosage;
                row["quantity"] = d.quantity;
                row["action"] = d.action;
                dt.Rows.Add(row);
            }
            return dt;
        }
        public string createMedicineTempTable(string tableName)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format("CREATE TABLE {0}", tableName));
            sb.AppendLine("(");
            sb.AppendLine(" med_id INT NOT NULL,");
            sb.AppendLine(" consult_med_id INT NULL,");
            sb.AppendLine(" medicine VARCHAR(50) NULL,");
            sb.AppendLine(" dosage VARCHAR(50) NULL,");
            sb.AppendLine(" quantity VARCHAR(50) NULL,");
            sb.AppendLine(" action VARCHAR(5) NULL,");
            sb.AppendLine(")");
            return sb.ToString();
        }
        public void DeleteConsultation(int[] consultation_ids)
        {
            var param = new List<SqlParameter>();

            string uspText = "usp_person_consult_details_del";
            ado.BatchBulkSave(uspText, createDataTable(consultation_ids), "##consultation", createTempTable("##consultation"), param.ToArray());
        }
        private DataTable createDataTable(int[] data)
        {
            var dt = new DataTable();
            dt.Columns.Add("consultation_id");
            foreach (int consult_id in data)
            {
                var row = dt.NewRow();
                row["consultation_id"] = consult_id;
                dt.Rows.Add(row);
            }
            return dt;
        }
        private string createTempTable(string tableName)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format("CREATE TABLE {0}", tableName));
            sb.AppendLine("(");
            sb.AppendLine(" consultation_id INT NOT NULL,");
            sb.AppendLine(")");
            return sb.ToString();
        }
        public IReadOnlyCollection<Medication> GetConsultationMed(int person_id, int consultation_id)
        {
            var param = new List<SqlParameter>();
            var medList = new List<Medication>();
           
            param.Add(new SqlParameter("@person_id", person_id));
            param.Add(new SqlParameter("@consultation_id", consultation_id));
            using (var ds = ado.FillData("usp_person_consult_medicine", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var med = new Medication();
                    med.consult_med_id = Convert.ToInt32(row["consult_med_id"]);
                    med.consultation_id = Convert.ToInt32(row["consultation_id"]);
                    med.person_id = Convert.ToInt32(row["person_id"]);
                    med.med_id = Convert.ToInt32(row["medicine_id"]);
                    med.medicine = row["medicine"].ToString();
                    med.quantity = Convert.ToInt32(row["med_quantity"]);
                    med.dosage = row["dosage"].ToString();
                    med.date_given = Convert.ToDateTime(row["date_given"].ToString() == DBNull.Value.ToString() ? null : row["date_given"]);
                    med.onhand = Convert.ToInt32(row["onhand"]);
                    medList.Add(med);
                }
                return medList;
            }
        }
    }
}
