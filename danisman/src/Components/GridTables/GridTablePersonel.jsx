import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import axios from "axios";

const GridTablePersonel = () => {
  const [data, setData] = useState([]);

  const dataAl = async () =>
    await axios
      .get("http://localhost:9000/api/personel")
      .then((res) => setData(res.data));
  useEffect(() => {
    dataAl();
  }, []);

  const [merkezIsimAl, setMerkezIsimAl] = useState([]);
  let merkezIsimleri = [];
  useEffect(() => {
    axios
      .get("http://localhost:9000/api/merkez")
      .then((res) => setMerkezIsimAl(res.data));
  }, []);

  merkezIsimAl.map((item) =>
    merkezIsimleri.push({
      merkez_id: item.merkez_id,
      merkez_isim: item.merkez_isim,
    })
  );

  const uniqueMerkez = [];

  const unique = merkezIsimleri.filter((element) => {
    const isDuplicate = uniqueMerkez.includes(element.merkez_id);
    if (!isDuplicate) {
      uniqueMerkez.push(element.merkez_id);
      return true;
    }
    return false;
  });

  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          options={{
            filtering: true,
            search: true,
            sorting: true,
          }}
          columns={[
            {
              title: "Id",
              field: "personel_id",
              type: "numeric" /*checkbox vs olabiliyor*/,
              editable: false,
            },
            {
              title: "Adı",
              field: "firstname",
              validate: (rowData) =>
                rowData.firstname === undefined || rowData.firstname === ""
                  ? "Zorunlu"
                  : true,
            },
            {
              title: "Soyadı",
              field: "surname",
              validate: (rowData) =>
                rowData.surname === undefined || rowData.surname === ""
                  ? "Zorunlu"
                  : true,
            },
            {
              title: "Telefon",
              field: "p_telefon1",
              type:"numeric",
              validate: (rowData) =>
                rowData.p_telefon1 === undefined || rowData.p_telefon1 === ""
                  ? "Zorunlu"
                  : true,
            },
            {
              title: "Telefon 2",
              field: "p_telefon2",
              type:"numeric",
            },
            {
              title: "TC",
              field: "TC",
              type:"numeric",
              validate: (rowData) =>
              rowData.TC === undefined || rowData.TC === ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Kan Grubu",
              field: "kan_grubu",
              validate: (rowData) =>
              rowData.kan_grubu === undefined || rowData.kan_grubu === ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "İkamet Adresi",
              field: "ikamet_adresi",
              validate: (rowData) =>
              rowData.ikamet_adresi === undefined || rowData.ikamet_adresi === ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Çalışma Durumu",
              field: "calisma_durumu",
              validate: (rowData) =>
              rowData.calisma_durumu === undefined || rowData.calisma_durumu === ""
                ? "Zorunlu"
                : true,
              lookup: {0:"Çalışmıyor",1:"Çalışıyor"}
            },
            {
              title: "Proje Saha Adresi",
              field: "proje_saha_adresi",
              validate: (rowData) =>
              rowData.proje_saha_adresi === undefined || rowData.proje_saha_adresi === ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Acil Durumda Aranacak Kişi Ad Soyad",
              field: "ADAK_adı_soyadı",
              validate: (rowData) =>
              rowData.ADAK_adı_soyadı=== undefined || rowData.ADAK_adı_soyadı=== ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Acil Durumda Aranacak Kişi Telefon",
              field: "ADAK_telefon",
              validate: (rowData) =>
              rowData.ADAK_telefon=== undefined || rowData.ADAK_telefon=== ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Acil Durumda Aranacak Kişi İle Bağı",
              field: "ADAK_Bağı",
              validate: (rowData) =>
              rowData.ADAK_Bağı=== undefined || rowData.ADAK_Bağı=== ""
                ? "Zorunlu"
                : true,
            },
            {
              title: "Bağlı Olduğu Merkez",
              field: "merkez_id",
              render: (rowData) =>
                unique.find((item) => item.merkez_id == rowData.merkez_id)
                  ?.merkez_isim,
              validate: (rowData) =>
                rowData.merkez_id === undefined || rowData.merkez_id === ""
                  ? "Zorunlu"
                  : true,
              lookup: unique.map(item=>item.merkez_isim)  
            },
          ]}
          data={data}
          title="Personel Tablo"
          editable={{
            onRowAdd: async (newData) => {
              await axios.post("http://localhost:9000/api/personel", newData);
              dataAl();
            },
            onRowUpdate: async (newData, oldData) => {
              await axios.put(
                `http://localhost:9000/api/personel/${oldData.personel_id}`,
                {
                  firstname: newData.firstname,
                  surname: newData.surname,
                  p_telefon1: newData.p_telefon1,
                  p_telefon2: newData.p_telefon2,
                  TC: newData.TC,
                  kan_grubu: newData.kan_grubu,
                  ikamet_adresi: newData.ikamet_adresi,
                  calisma_durumu: newData.calisma_durumu,
                  proje_saha_adresi: newData.proje_saha_adresi,
                  ADAK_adı_soyadı: newData.ADAK_adı_soyadı,
                  ADAK_telefon: newData.ADAK_telefon,
                  ADAK_Bağı: newData.ADAK_Bağı,
                  merkez_id: newData.merkez_id,
                }
              );
              dataAl();
            },
            onRowDelete:async (oldData) =>{
            await axios.delete(`http://localhost:9000/api/personel/${oldData.personel_id}`);
            dataAl();}
          }}
        />
      </div>
    </>
  );
};

export default GridTablePersonel;
