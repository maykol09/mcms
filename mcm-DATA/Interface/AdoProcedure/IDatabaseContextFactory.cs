using System;
using System.Collections.Generic;
using System.Text;

namespace NBC_DATA.Interface.AdoProcedure
{
    public interface IDatabaseContextFactory
    {
        IDatabaseContext Context();
    }
}
