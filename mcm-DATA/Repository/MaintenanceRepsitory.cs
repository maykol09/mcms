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
    public class MaintenanceRepsitory: IMaintenanceRepository
    {
        private readonly IAdoProcedureRepository ado;
        public MaintenanceRepsitory(IAdoProcedureRepository ado)
        {
            this.ado = ado;
        }

        public IReadOnlyCollection<UserAccess> GetUser()
        {
            var param = new List<SqlParameter>();
            var list_userAcess = new List<UserAccess>();
            using(var ds = ado.FillData("usp_lib_user_level_get", param.ToArray()))
            {
               
                var rows = ds.Tables[0].Rows;
                foreach(DataRow row in rows)
                {
                    var userAccess = new UserAccess();
                    userAccess.user_id = Convert.ToInt16(row["lib_user_level_id"]);
                    userAccess.user_name = row["user_name"].ToString();
                    userAccess.user_level = Convert.ToInt16(row["user_level"]);
                    userAccess.created_by = row["created_by"].ToString();
                    userAccess.date_created = Convert.ToDateTime(row["date_created"]).ToString();
                    list_userAcess.Add(userAccess);
                }
                return list_userAcess;
            }
        }

        public void SaveUser(List<UserAccess> data)
        {
            var param = new List<SqlParameter>();
            string uspText = "usp_lib_user_level_save";
            ado.BatchBulkSave(uspText, createUserDataTable(data), "##userAccess", createUserTempTable("##userAccess"), param.ToArray());
        }
        public DataTable createUserDataTable(List<UserAccess> data)
        {
            var dt = new DataTable();
            dt.Columns.Add("user_id");
            dt.Columns.Add("user_name");
            dt.Columns.Add("user_level");
            dt.Columns.Add("created_by");
            dt.Columns.Add("action");
            foreach (var d in data)
            {
                var row = dt.NewRow();
                row["user_id"] = d.user_id;
                row["user_name"] = d.user_name;
                row["user_level"] = d.user_level;
                row["created_by"] = d.created_by;
                row["action"] = d.action;
                dt.Rows.Add(row);
            }
            return dt;
        }
        public string createUserTempTable(string tableName)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format("CREATE TABLE {0}", tableName));
            sb.AppendLine("(");
            sb.AppendLine(" user_id INT NOT NULL,");
            sb.AppendLine(" user_name VARCHAR(50) NULL,");
            sb.AppendLine(" user_level VARCHAR(50) NULL,");
            sb.AppendLine(" created_by VARCHAR(50) NULL,");
            sb.AppendLine(" action VARCHAR(5) NULL,");
            sb.AppendLine(")");
            return sb.ToString();
        }

        public void DeleteUser(int user_id)
        {
            var param = new SqlParameter("user_id", user_id);

            ado.ExecuteNonQuery("usp_lib_user_level_del", param);
            
        }



        public IReadOnlyCollection<LibReference> GetReference()
        {
            var param = new List<SqlParameter>();
            var list_libRef = new List<LibReference>();
            using (var ds = ado.FillData("usp_lib_reference_get", param.ToArray()))
            {

                var rows = ds.Tables[0].Rows;
                foreach (DataRow row in rows)
                {
                    var libRef = new LibReference();
                    libRef.ref_id = Convert.ToInt32(row["ref_id"]);
                    libRef.ref_name = row["ref_desc"].ToString();
                    libRef.ref_type = row["ref_type"].ToString();
                    libRef.ref_code = row["ref_code"].ToString();
                    list_libRef.Add(libRef);
                }
                return list_libRef;
            }
        }

        public void SaveReference(List<LibReference> data)
        {
            var param = new List<SqlParameter>();
            string uspText = "usp_lib_reference_save";
            ado.BatchBulkSave(uspText, createReferenceDataTable(data), "##libReference", createReferenceTempTable("##libReference"), param.ToArray());
        }
        public DataTable createReferenceDataTable(List<LibReference> data)
        {
            var dt = new DataTable();
            dt.Columns.Add("ref_id");
            dt.Columns.Add("ref_name");
            dt.Columns.Add("ref_type");
            dt.Columns.Add("ref_code");
            dt.Columns.Add("action");
            foreach (var d in data)
            {
                var row = dt.NewRow();
                row["ref_id"] = d.ref_id;
                row["ref_name"] = d.ref_name;
                row["ref_type"] = d.ref_type;
                row["ref_code"] = d.ref_code;
                row["action"] = d.action;
                dt.Rows.Add(row);
            }
            return dt;
        }
        public string createReferenceTempTable(string tableName)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format("CREATE TABLE {0}", tableName));
            sb.AppendLine("(");
            sb.AppendLine(" ref_id INT NOT NULL,");
            sb.AppendLine(" ref_name VARCHAR(50) NULL,");
            sb.AppendLine(" ref_type VARCHAR(50) NULL,");
            sb.AppendLine(" ref_code VARCHAR(50) NULL,");
            sb.AppendLine(" action VARCHAR(5) NULL,");
            sb.AppendLine(")");
            return sb.ToString();
        }

        public void DeleteReference(int ref_id)
        {
            var param = new SqlParameter("ref_id", ref_id);

            ado.ExecuteNonQuery("usp_lib_reference_del", param);

        }
    }
}
