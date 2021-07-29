using System;
using System.Collections.Generic;
using System.Text;

namespace NBC_DATA.Extension
{
    public static class CryptoExtension
    {
        public static string Encrypt(this string target)
        {
            return new CryptLib.CryptLib().Encrypt3DES(target);
        }
        public static string Decrypt(this string target)
        {
            return new CryptLib.CryptLib().Decrypt3DES(target);
        }
    }
}
