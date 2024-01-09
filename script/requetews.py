import requests
from datetime import datetime
import mysql.connector
import time

while True : 
    try:

        url = "http://app.objco.com:8099/?account=NTB37PKZUG&limit=1"

        reponse = requests.get(url)

        donnee = reponse.json()

        print(donnee)
        cnx = mysql.connector.connect(user='groupe3meteo', password='adminEUH69',
                                    host='hz1.vps.ykpf.net',
                                    database='groupe3meteo',port=3306)
        cursor = cnx.cursor()
        from datetime import datetime

        for item in donnee:
            date_str = datetime.strptime(item[8], "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d %H:%M:%S")
                
            reqsql = f"INSERT INTO JOURNAL_API (ID,NUM_REC,NUM_CAP,ETAT,TEMP,NVL_HUM,NVL_BAT,`SIGNAL`,DATE_HEURE) VALUES ({item[0]},'{item[1]}','{item[2]}',{item[3]},{item[4]},{item[5]},{item[6]},{item[7]},'{date_str}')"
            cursor.execute(reqsql)
        
        cnx.commit()
        print(cursor.rowcount,"record envoyés")
        time.sleep(5*60)
    except ValueError:
        print("probleme")
        cnx.close()
