using Newtonsoft.Json;

namespace DataService.Infrastructure
{
    public static class JsonService
    {
        // public static T Clone<T>(T RealObject)
        // {
        //     using (Stream objectStream = new MemoryStream())
        //     {
        //         IFormatter formatter = new BinaryFormatter();
        //         formatter.Serialize(objectStream, RealObject);
        //         objectStream.Seek(0, SeekOrigin.Begin);
        //         return (T)formatter.Deserialize(objectStream);
        //     }
        // }

        public static JsonSerializerSettings SelfLoopJsonSettings = new JsonSerializerSettings()
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            PreserveReferencesHandling = PreserveReferencesHandling.Objects
        };
        public static string SerializeObject(object serializeObject, JsonSerializerSettings jsonSerializerSetting = null)
        {
            if (jsonSerializerSetting == null)
            {
                return JsonConvert.SerializeObject(serializeObject, SelfLoopJsonSettings);
            }
            return JsonConvert.SerializeObject(serializeObject, jsonSerializerSetting);
        }
        public static T DeserializeObject<T>(string serializeString, JsonSerializerSettings jsonSerializerSetting = null)
        {
            if (jsonSerializerSetting == null)
            {
                return (T)JsonConvert.DeserializeObject(serializeString, typeof(T), SelfLoopJsonSettings);
            }
            return (T)JsonConvert.DeserializeObject(serializeString, typeof(T), SelfLoopJsonSettings);
        }
    }
}
