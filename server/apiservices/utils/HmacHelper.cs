using System;
using System.Security.Cryptography;
using System.Text;

namespace ApiService.Utils
{
    public static class HmacHelper
    {
        public static Object Hash_HMAC(string signatureString, string secretKey, bool raw_output = false)
        {
            var enc = Encoding.UTF8;
            HMACSHA1 hmac = new HMACSHA1(enc.GetBytes(secretKey));

            hmac.Initialize();

            byte[] buffer = enc.GetBytes(signatureString);
            if (raw_output)
            {
                // return Convert.ToBase64String(hmac.ComputeHash(buffer)).Trim();
                return hmac.ComputeHash(buffer);
            }
            else
            {
                return Convert.ToBase64String(hmac.ComputeHash(buffer)).Trim();
                // return BitConverter.ToString(hmac.ComputeHash(buffer)).Replace("-", "").ToLower().Trim();
            }
        }

        public static string HmacSha1ToBase64(string signatureString, string secretKey)
        {
            var enc = Encoding.UTF8;
            HMACSHA1 hmac = new HMACSHA1(enc.GetBytes(secretKey));
            hmac.Initialize();
            byte[] buffer = enc.GetBytes(signatureString);
            return Convert.ToBase64String(hmac.ComputeHash(buffer)).Trim();
        }

        public static byte[] HmacSha1ToByte(string signatureString, string secretKey)
        {
            var enc = Encoding.UTF8;
            HMACSHA1 hmac = new HMACSHA1(enc.GetBytes(secretKey));
            hmac.Initialize();
            byte[] buffer = enc.GetBytes(signatureString);
            return hmac.ComputeHash(buffer);
        }

        // public static string hash_hmac2(string signatureString, string secretKey, bool raw_output = false)
        // {
        //     SHA1 sha = new SHA1CryptoServiceProvider();
        //     ASCIIEncoding enc = new ASCIIEncoding();
        //     byte[] dataToHash = enc.GetBytes(signatureString);
        //     byte[] dataHashed = sha.ComputeHash(dataToHash);
        //     string hash = BitConverter.ToString(dataHashed).Replace("-", "").ToLower();
        //     return hash;
        // }
        //MD5
        public static string MD5_Hash(string str_md5_in)
        {
            Guid.NewGuid().ToString("D");//a-b-c 默认形式
            Guid.NewGuid().ToString("N"); //abcdef
            Guid.NewGuid().ToString("B"); // {a-b-c}
            Guid.NewGuid().ToString("P"); //(1-b-c)
            Guid.NewGuid().ToString("X"); //{0xadf,0xdfd{0xabd}}
            MD5 md5 = MD5.Create(); // MD5CryptoServiceProvider();
            byte[] bytes_md5_in = UTF8Encoding.UTF8.GetBytes(str_md5_in);
            byte[] bytes_md5_out = md5.ComputeHash(bytes_md5_in);
            string str_md5_out = BitConverter.ToString(bytes_md5_out);
            str_md5_out = str_md5_out.Replace("-", "");
            return str_md5_out;
        }



        public static string ByteToHexString(byte[] bytes)
        {
            string result = "";
            // if (bytes != null)
            // {
            //     for (int i = 0; i < bytes.Length; i++)
            //     {
            //         result += bytes[i].ToString("X2");
            //     }
            // }
            foreach (var item in bytes)
            {
                //result += string.Format("{0:X2}", item);
                result += item.ToString("X2");
            }
            return result;
        }
        public static byte[] HexStringToByte(string hexString)
        {
            string[] byteStrings = hexString.Split(" ".ToCharArray());
            byte[] byteOuts = new byte[byteStrings.Length - 1];
            for (int i = 0; i < byteStrings.Length - 1; i++)
            {
                byteOuts[i] = Convert.ToByte(("0x" + byteStrings[i]));
            }
            return byteOuts;
        }

    }
}
