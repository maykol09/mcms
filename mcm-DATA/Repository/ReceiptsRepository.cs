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
    public class ReceiptsRepository : IReceiptsRepository
    {
        private readonly IAdoProcedureRepository ado;
        public ReceiptsRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }
        public IReadOnlyCollection<MedicineReceipts> GetReceipts(string from, string to)
        {
            var newFrom = Convert.ToDateTime(new string(from.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");
            var newTo = Convert.ToDateTime(new string(to.Where(c => c != '\u200E').ToArray())).ToString("yyyy-MM-dd");

            var param = new List<SqlParameter>();
            var medication_list = new List<MedicineReceipts>();
            param.Add(new SqlParameter("@from", newFrom));
            param.Add(new SqlParameter("@to", newTo));
            using (var ds = ado.FillData("usp_medicine_receipts_list", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var medication = new MedicineReceipts();
                    medication.si_id = Convert.ToInt32(row["si_id"]);
                    medication.stock_in_no = Convert.ToInt32(row["si_no"]);
                    medication.date_received = Convert.ToDateTime(row["si_date"].ToString() == DBNull.Value.ToString() ? null : row["si_date"]);
                    medication.invoice_no = row["ref_no"].ToString();
                    medication.supplier = row["ref_desc"].ToString();
                    medication.status = row["status_desc"].ToString();
                    medication.remarks = row["remarks"].ToString();
                    medication_list.Add(medication);
                }
                return medication_list;
            }
        }
        public int SaveReceipts(MedicineReceipts data)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@si_no", data.stock_in_no));
            param.Add(new SqlParameter("@si_date", data.date_received));
            param.Add(new SqlParameter("@supplier_id", data.supplier));
            param.Add(new SqlParameter("@invoice", data.invoice_no));
            param.Add(new SqlParameter("@remarks", data.remarks));
            param.Add(new SqlParameter("@status", data.status == "Draft" ? "D" : "P"));
            param.Add(new SqlParameter("@user", data.user));

            if (data.action == "I")
            {
                using (var result = ado.FillData("usp_medicine_si_ins", param.ToArray()))
                {
                    var si_id = Convert.ToInt32(result.Tables[0].Rows[0][0]);
                    SaveMedicine(data.list_receveived_med, si_id, data.med_id);
                    return si_id;
                }
               
            }
            else
            {
                param.Add(new SqlParameter("@si_id", data.si_id));
                ado.ExecuteNonQuery("usp_medicine_si_upd", param.ToArray());
                SaveMedicine(data.list_receveived_med, data.si_id, data.med_id);
                return data.si_id;
            }
        }
        public void SaveMedicine(List<ReceivedMedicine> data, int si_id, int med_id)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@si_id", si_id));
            param.Add(new SqlParameter("@si_med_id", med_id));
            string uspText = "usp_receipts_medicine_save";

            ado.BatchBulkSave(uspText, createMedicineDataTable(data), "##receipts_medicine", createMedicineTempTable("##receipts_medicine"), param.ToArray());
        }
        public DataTable createMedicineDataTable(List<ReceivedMedicine> data)
        {
            var dt = new DataTable();
            dt.Columns.Add("si_med_id");
            dt.Columns.Add("medicine_id");
            dt.Columns.Add("medicine_cost");
            dt.Columns.Add("qty_in");
            dt.Columns.Add("remarks");
            dt.Columns.Add("updated_by");
            dt.Columns.Add("action");
            foreach (var d in data)
            {
                var row = dt.NewRow();
                row["si_med_id"] = d.si_med_id;
                row["medicine_id"] = d.med_id;
                row["medicine_cost"] = d.cost;
                row["qty_in"] = d.quantity;
                row["remarks"] = d.remarks;
                row["updated_by"] = d.user;
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
            sb.AppendLine(" si_med_id INT NOT NULL,");
            sb.AppendLine(" medicine_id INT NULL,");
            sb.AppendLine(" medicine_cost INT NULL,");
            sb.AppendLine(" qty_in INT NULL,");
            sb.AppendLine(" remarks VARCHAR(255) NULL,");
            sb.AppendLine(" updated_by VARCHAR(50) NULL,");
            sb.AppendLine(" action VARCHAR(5) NULL");
            sb.AppendLine(")");
            return sb.ToString();
        }
        public IReadOnlyCollection<ReceivedMedicine> GetStockMedicine(int si_id)
        {
            var param = new List<SqlParameter>();
            var list_receivedMed = new List<ReceivedMedicine>();
            param.Add(new SqlParameter("@si_id", si_id));

            using (var result = ado.FillData("usp_medicine_si_item_get", param.ToArray()))
            {
                var rows = result.Tables[0].Rows;
                foreach(DataRow row in rows)
                {
                    var receivedMed = new ReceivedMedicine();
                    receivedMed.si_med_id = Convert.ToInt32(row["si_med_id"]);
                    receivedMed.med_id = Convert.ToInt32(row["medicine_id"]);
                    receivedMed.si_id = Convert.ToInt32(row["si_id"]);
                    receivedMed.med_name = row["medicine_name"].ToString();
                    receivedMed.quantity = Convert.ToInt32(row["qty_in"]);
                    receivedMed.cost = Convert.ToInt32(row["medicine_cost"]);
                    receivedMed.remarks = row["remarks"].ToString();
                    list_receivedMed.Add(receivedMed);
                }
                return list_receivedMed;
            }

        }
        public void DeleteReceipts(int si_id)
        {
            var param = new List<SqlParameter>();
            var list_receivedMed = new List<ReceivedMedicine>();
            param.Add(new SqlParameter("@si_id", si_id));

            ado.FillData("usp_medicine_si_del", param.ToArray());
           

        }
    }
}
