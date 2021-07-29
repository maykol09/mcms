using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace NBC_DATA.Interface
{
    public interface IDatabaseContext : IDisposable
    {
        SqlConnection Connection { get; }
    }
}
