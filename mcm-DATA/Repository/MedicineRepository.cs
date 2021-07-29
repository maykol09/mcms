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
    public class MedicineRepository: IMedicineRepository
    {
        private readonly IAdoProcedureRepository ado;
        public MedicineRepository(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }

        public DataTable GetMedicines()
        {
            var param = new List<SqlParameter>();
            using (var ds = ado.FillData("usp_medicine_get", param.ToArray()))
            {
                return ds.Tables[0];
            }
        }
        public void DeleteMedicine(int med_id)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@med_id", med_id));
            ado.ExecuteNonQuery("usp_medicine_details_del", param.ToArray());

        }
        public MedicineDetails GetMedicineDetails(int med_id)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@med_id", med_id));
            using (var ds = ado.FillData("usp_medicine_details_get", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows[0];
                var med_details = new MedicineDetails();
                med_details.med_code = rows["medicine_code"].ToString();
                med_details.med_name = rows["medicine_name"].ToString();
                med_details.med_class = rows["medicine_class"].ToString();
                med_details.med_unit = rows["medicine_unit"].ToString();
                med_details.med_onhand = Convert.ToInt32(rows["onhand"].ToString() == DBNull.Value.ToString() ? 0 : rows["onhand"]);
                med_details.med_cost = Convert.ToInt32(rows["medicine_cost"].ToString() == DBNull.Value.ToString() ? 0 : rows["medicine_cost"]);
                med_details.reorder_qty = Convert.ToInt32(rows["reorder_qty"].ToString() == DBNull.Value.ToString() ? 0 : rows["reorder_qty"]);
                med_details.order_qty = Convert.ToInt32(rows["order_qty"].ToString() == DBNull.Value.ToString() ? 0 : rows["order_qty"]);
                med_details.is_active = Convert.ToBoolean(rows["is_active"]);
                return med_details;
            }
        }
        public int SaveMedicineDetails(MedicineDetails data)
        {
            var param = new List<SqlParameter>();

           
            param.Add(new SqlParameter("@code",nullToDbNull(data.med_code)));
            param.Add(new SqlParameter("@name", data.med_name));
            param.Add(new SqlParameter("@class", nullToDbNull(data.med_class)));
            param.Add(new SqlParameter("@unit", nullToDbNull(data.med_unit)));
            param.Add(new SqlParameter("@reorder", intNull(data.reorder_qty)));
            param.Add(new SqlParameter("@order", intNull(data.order_qty)));
            param.Add(new SqlParameter("@is_active", data.is_active));
            param.Add(new SqlParameter("@user", "ogdocm"));

            if (data.action == "I")
            {
                using (var ds = ado.FillData("usp_medicine_details_ins", param.ToArray()))
                {
                    return Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                }
            }
            else
            {
                param.Add(new SqlParameter("@med_id", data.med_id));
                ado.ExecuteNonQuery("usp_medicine_details_upd", param.ToArray());
                return data.med_id;
            }
        }
        public IReadOnlyCollection<ReceivedMedicine> GetReceivedMed(int med_id)
        {
            var param = new List<SqlParameter>();
            var rec_med_list = new List<ReceivedMedicine>();
            param.Add(new SqlParameter("@med_id", med_id));
            using (var ds = ado.FillData("usp_medicine_received_list", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach(DataRow row in rows)
                {
                    var rec_med = new ReceivedMedicine();
                    rec_med.med_id = Convert.ToInt32(row["medicine_id"]);
                    rec_med.date_received = Convert.ToDateTime(row["si_date"].ToString() == DBNull.Value.ToString() ? null : row["si_date"]);
                    rec_med.quantity = Convert.ToInt32(row["qty_in"].ToString() == DBNull.Value.ToString() ? 0 : row["qty_in"]);
                    rec_med.cost = Convert.ToInt32(row["medicine_cost"].ToString() == DBNull.Value.ToString() ? 0 : row["medicine_cost"]);
                    rec_med.remarks = row["remarks"].ToString();
                    rec_med_list.Add(rec_med);
                }
                return rec_med_list;
            }
        }
        public IReadOnlyCollection<IssuedMedicine> GetIssuedMed(int med_id)
        {
            var param = new List<SqlParameter>();
            var issued_med_list = new List<IssuedMedicine>();
            param.Add(new SqlParameter("@med_id", med_id));
            using (var ds = ado.FillData("usp_medicine_issued_list", param.ToArray()))
            {
                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var issued_med = new IssuedMedicine();
                    issued_med.consultation_id = Convert.ToInt32(row["consultation_id"].ToString() == DBNull.Value.ToString() ? 0 : row["consultation_id"]);
                    issued_med.date_consulted = Convert.ToDateTime(row["date_consulted"].ToString() == DBNull.Value.ToString() ? 0 : row["date_consulted"]);
                    issued_med.full_name = row["name"].ToString();
                    issued_med.quantity = Convert.ToInt16(row["quantity"].ToString() == DBNull.Value.ToString() ? 0 : row["quantity"]);
                    issued_med.dosage = row["dosage"].ToString();
                    issued_med_list.Add(issued_med);
                }
                return issued_med_list;
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
