declare -a arr=("ACC" "ACM" "AMST" "ANAT" "ANSC" "ANTH" "ARAB" "ARCH" "ART" "AS" "ASAN" "ASTR" "BE" "BIOC" "BIOL" "BIOM" "BLAW" "BOT" "BUS" "CAAM" "CAM" "CAS" "CEE" "CHAM" "CHEM" "CHN" "CIS" "CMB" "COM" "CSD" "CUL" "DH" "DIS" "DNCE" "DRB" "EALL" "ECON" "EDCS" "EDEA" "EDEF" "EDEP" "EE" "ELI" "ENG" "ENGR" "ES" "ETEC" "FAMR" "FIL" "FIN" "FMCH" "FR" "FSHN" "GEOG" "GER" "GERI" "GG" "GRK" "HAW" "HIST" "HNDI" "HON" "HRM" "HWST" "ICS" "ILO" "IND" "INS" "IP" "IS" "ITAL" "ITE" "ITM" "JOUR" "JPN" "KOR" "KRS" "LAIS" "LATN" "LAW" "LING" "LIS" "LLEA" "LLL" "LLM" "LWEV" "LWJT" "LWLW" "LWPA" "LWUL" "MAO" "MATH" "MBBE" "MDED" "ME" "MED" "MEDT" "MET" "MGT" "MICR" "MKT" "MSL" "MUS" "NHH" "NREM" "NURS" "OBGN" "OCN" "OEST" "ORE" "PACE" "PACS" "PATH" "PED" "PEPS" "PH" "PHIL" "PHRM" "PHYL" "PHYS" "PLAN" "POLS" "PORT" "PPC" "PPST" "PSTY" "PSY" "PUBA" "RE" "REL" "REPR" "RUS" "SAM" "SLS" "SNSK" "SOC" "SOCS" "SP" "SPAN" "SPED" "SURG" "SW" "TAHT" "THAI" "THEA" "TI" "TIM" "TONG" "TPSS" "TRMD" "VIET" "WS" "ZOOL")

for DEPT in "${arr[@]}"
do
	echo $DEPT
	/usr/local/bin/phantomjs run-uhfind-cli.js $DEPT 
done
