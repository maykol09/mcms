using mcm_DATA.Entities;
using mcm_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace mcm_DATA.Repository
{
    public class ReportsRepository : IReportsRepository
    {
        private readonly IAdoProcedureRepository ado;

        public ReportsRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }
        public IReadOnlyCollection<Consultation> GetConsultationReports(string from, string to)
        {
            var newFrom = Convert.ToDateTime(new string(from.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");
            var newTo = Convert.ToDateTime(new string(to.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");

            var param = new List<SqlParameter>();
            var consult_list = new List<Consultation>();
            param.Add(new SqlParameter("@from", newFrom));
            param.Add(new SqlParameter("@to", newTo));
            using(var ds = ado.FillData("usp_consultation_reports_get", param.ToArray()))
            {
               
                var rows = ds.Tables[0].Rows;
                foreach(DataRow row in rows){
                    var consult = new Consultation();
                    consult.date_consulted = Convert.ToDateTime(row["date_consulted"].ToString() == DBNull.Value.ToString() ? null : row["date_consulted"]);
                    consult.complaints = row["complaints"].ToString();
                    consult.diagnosis = row["diagnosis"].ToString();
                    consult.staff = row["staff"].ToString();
                    consult.staff_category = row["staff_category"].ToString();
                    consult.treatment = row["treatment"].ToString();
                    consult_list.Add(consult);
                }
                return consult_list;
            }
        }
        public IReadOnlyCollection<Medication> GetMedicationReports(string from, string to)
        {
            var newFrom = Convert.ToDateTime(new string(from.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");
            var newTo = Convert.ToDateTime(new string(to.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");

            var param = new List<SqlParameter>();
            var medication_list = new List<Medication>();
            param.Add(new SqlParameter("@from", newFrom));
            param.Add(new SqlParameter("@to", newTo));
            using (var ds = ado.FillData("usp_medication_reports_get", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var medication = new Medication();
                    medication.date_given = Convert.ToDateTime(row["date_given"].ToString() == DBNull.Value.ToString() ? null : row["date_given"]);
                    medication.medicine = row["medicine"].ToString();
                    medication.quantity = Convert.ToInt32(row["quantity"].ToString() == DBNull.Value.ToString() ? 0 : row["quantity"]);
                    medication.dosage = row["dosage"].ToString();
                    medication.staff = row["staff"].ToString();
                    medication.staff_category = row["staff_category"].ToString();
                    medication.diagnosis = row["diagnosis"].ToString();
                    medication.is_active = Convert.ToInt16(row["is_active"].ToString() == DBNull.Value.ToString() ? 0 : row["is_active"]);
                    medication_list.Add(medication);
                }
                return medication_list;
            }
        }
        public IReadOnlyCollection<MedicineDetails> GetMedicineReports()
        {
            //var newFrom = Convert.ToDateTime(from).ToString("yyyy-MM-dd");
            //var newTo = Convert.ToDateTime(to).ToString("yyyy-MM-dd");

            var param = new List<SqlParameter>();
            var medicine_list = new List<MedicineDetails>();
            //param.Add(new SqlParameter("@from", newFrom));
            //param.Add(new SqlParameter("@to", newTo));
            using (var ds = ado.FillData("usp_medicine_reports_get", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var medicine = new MedicineDetails();
                    medicine.med_name = row["medicine_name"].ToString();
                    medicine.med_class = row["medicine_class"].ToString();
                    medicine.med_unit = row["medicine_unit"].ToString();
                    medicine.med_received = Convert.ToInt32(row["received"].ToString() == DBNull.Value.ToString() ? 0 : row["received"]);
                    medicine.med_issued = Convert.ToInt32(row["issued"].ToString() == DBNull.Value.ToString() ? 0 : row["issued"]);
                    medicine.med_onhand = Convert.ToInt32(row["onhand"].ToString() == DBNull.Value.ToString() ? 0 : row["onhand"]);
                    medicine.is_active = Convert.ToBoolean(row["is_active"]);
                    medicine_list.Add(medicine);
                }
                return medicine_list;
            }
        }
    }
}
