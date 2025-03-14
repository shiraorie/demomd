### Наша задача разными схэмами обмануть эту гребаную лабалаторку :rocket:


![image](https://github.com/user-attachments/assets/e7485aff-1f4f-405d-8f19-3b5c757c3dd4)

![image](https://github.com/user-attachments/assets/b98e16b5-2f6b-4a10-bdd5-fc3c31b0f139)


### HQ-RTR
```bash
hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash
````
```bash
nano /etc/network/interfaces
```
HQ-RTR INTERFACES
````
auto ens18
iface ens18 inet static
address 172.16.4.2/28
gateway 172.16.4.1

auto ens19
iface ens19 inet static
address 192.168.100.1/26

auto tun0
iface tun0 inet tunnel
mode gre
address 172.16.100.1
netmask 255.255.255.252
local 172.16.4.2
endpoint 172.16.5.2
ttl 255
````

````
systemctl restart networking
````

````
nano /etc/sysctl.conf || echo "net.ipv4.ip_forward=1" > /etc/sysctl.conf
````


````
nano /etc/nftables.conf
````
Nftables.conf
````
*** policy accept
table inet nat {
chain postrouting {
   type nat hook postrouting prioirty srcnat
   oif "ens18" ip saddr { 192.168.100.0/26, 192.168.10.0/28} masquerade
  }
}
````

````
systemctl enable --now nftables
````

````
/etc/nftables.conf
````

````
sysctl -p
````

````
apt update && apt install frr -y
````
Настройка фрр
````
nano /etc/frr/daemons
````

````
systemctl restart frr
````

Конфигурация фрр HQ-RTR

````
1. vtysh
2. conf t
3.router ospf
4.passive-interface default
4.network 192.168.100.0/26 area 0
5.network 192.168.10.0/28 area 0
6.network 172.16.100.0/30 area 0
7.int tun0
8.ex
9.line vty
10.password P@ssw0rd
11.end
````

````
systemctl restart frr
````

````
systemctl ENABLE --now frr
````

### BR-RTR

```bash
hostnamectl set-hostname br-rtr.au-team.irpo; exec bash
````
```bash
nano /etc/network/interfaces
```
HQ-RTR INTERFACES
````
auto ens18
iface ens18 inet static
address 172.16.5.2/28
gateway 172.16.5.1

auto ens19
iface ens19 inet static
address 192.168.200.1/27

auto tun0
iface tun0 inet tunnel
mode gre
address 172.16.100.2
netmask 255.255.255.252
local 172.16.5.2
endpoint 172.16.4.2
ttl 255
````

````
systemctl restart networking
````

````
nano /etc/sysctl.conf || echo "net.ipv4.ip_forward=1" > /etc/sysctl.conf
````


````
nano /etc/nftables.conf
````
Nftables.conf
````
*** policy accept
table inet nat {
chain postrouting {
   type nat hook postrouting prioirty srcnat
   oif "ens18" ip saddr { 192.168.200.0/27 } masquerade
  }
}
````

````
systemctl enable --now nftables
````

````
/etc/nftables.conf
````

````
sysctl -p
````

````
apt update && apt install frr -y
````
Настройка фрр
````
nano /etc/frr/daemons
````

````
systemctl restart frr
````

Конфигурация фрр BR-RTR

````
1. vtysh
2. conf t
3.router ospf
4.network 192.168.200.0/27 area 0
5.network 172.16.100.0/30 area 0
6.passive-interface default
7.int tun0
8.ex
9.line vty
10.password P@ssw0rd
11.end
````

````
systemctl restart frr
````

````
systemctl ENABLE --now frr
````

### HQ-SRV

````
hostnamectl set-hostname hq-srv.au-team.irpo; exec bash
````

````
nano /etc/network/interfaces
````

HQ-SRV INTERFACES
````
auto ens18
iface ens18 inet static
address 192.168.100.2/26
gateway 192.168.100.1
````


````
systemctl restart networking
````

### BR-SRV


````
hostnamectl set-hostname br-srv.au-team.irpo; exec bash
````

BR-SRV INTERFACES
````
auto ens18
iface ens18 inet static
address 192.168.200.2/27
gateway 192.168.200.1
````

````
systemctl restart networking
````

### HQ-SRV И BR-SRV
````
apt install sudo
````

````
useradd -u 1010 -m -s /bin/bash sshuser
````

````
passwd sshuser
````
P@ssword - Пароль

````
echo "sshuser ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
````

### HQ-RTR и BR-SRV

````
apt install sudo
````

````
useradd -u 1010 -m -s /bin/bash net_admin
````

````
passwd net_admin
````
P@ssword - Пароль

````
echo "net_admin ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
````

### HQ-SRV BR-SRV
````
apt install openssh-server openssh-client
````

````
nano /etc/ssh/sshd_config
````
:warning::warning::warning:Перемога:warning::warning:
Типо нада менять порт но нам по:rocket:уй
````
Port 2025
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/issue.net
````

````
echo "Authorized access only" > /etc/issue.net
````
````
systemctl restart sshd
````

### HQ-RTR DHCP
````
apt update && apt install -y isc-dhcp-server
````

````
nano /etc/init.d/isc-dhcp-server
````


````
echo "INTERFACES="/20"/" > /etc/init.d/isc-dhcp-server
````

````
nano /etc/dhcp/dhcpd.conf
````

````
subnet 192.168.10.0 netmask 255.255.255.240 {
  range 192.168.10.2 192.168.10.2;
  option routers 192.168.10.1;
  option domain-name-servers 192.168.100.2;
  server-name "au-team.irpo";
  option domain-name "au-team.irpo";
}
````

````
systemctl restart isc-dhcp-server
````

### HQ-SRV DNSMASQ

````
apt update && apt install -y dnsmasq
````

````
nano /etc/resolv.conf
````

````
nameserver 10.0.1.4
````

````
nano /etc/dnsmasq.conf
````

````
domain=au-team.irpo

server=/au-team.irpo/192.168.200.2

server=10.0.1.4

host-record=hq-rtr.au-team.irpo,192.168.100.1
host-record=hq-srv.au-team.irpo,192.168.100.2
host-record=hq-cli.au-team.irpo,192.168.10.2

host-record=br-rtr.au-team.irpo,hq-rtr.au-team.irpo
host-record=br-srv.au-team.irpo,hq-rtr.au-team.irpo

cname=wiki.au-team.irpo,hq-rtr.au-team.irpo
cname=moodle.au-team.irpo,irpo.au-team.irpo
````
````
nano /usr/share/dnsmasq/init-system-common
````
Нужно найти строку 
````
DNSMASQ_OPTS="${DNSMASSQ_OPTS} --local-service"
и превратить в 
DNSMASQ_OPTS="${DNSMASSQ_OPTS} "
````

````
systemctl restart dnsmasq
````


### Время на тачках Кчаууу 
<img src="https://github.com/user-attachments/assets/316cee62-8d4c-45ab-bbf2-db9457f48fab" width="150" height="150" />

````
timedatectl status
````
Если не Asia/Yekaterinburg то
````
timedatectl  set-timezone Asia/Yekaterinburg
````

# MOODLE EPTA 2

### BR-SRV

````
apt update && apt install -y samba* krb5* winbind smbclient
````

````
hostname
````
Ожидается ответ
br-srv.au-team.irpo

````
domainname au-team.irpo
````

Сброс самбы
````
rm -f /etc/samba/smb.conf
````

````
rm -rf /var/lib/samba
````

````
rm -rf /var/cache/samba/
````

````
mkdir -p /var/lib/samba/sysvol
````

````
ip link delete docker0
````

Настройка самбы 

````
Samba-tool --realm=au-team.irpo --domain=au-team –adminpass=”PAssw0rd” --dnsbackend=SAMBA_INTERNAL --option=”dns forwrder=192.168.100.2” --server-role=dc 
````
Обязательно reboot
````
reboot
````

````
samba-tool domain info 127.0.0.1
````

### CLI

удалить бред

````
apt-get remove alterator-datetime
````

````
apt-get update && apt-get install -y task-auth-ad-sssd
````

Потом тестим 

````
cat /etc/resolv.conf
````

⚠️⚠️ До того как написать host нужно сделать Это⚠️⚠️

на всех машинах а именно HQ-RTR,BR-RTR,HQ-SRV,BR-SRV,CLI
в /etc/resolv.conf прописать 192.168.100.2

````
host au-team.irpo
````

### Настройка AD CLI

![image](https://github.com/user-attachments/assets/ed2e7e8f-19cc-4cac-947e-042884cc922a)

![image](https://github.com/user-attachments/assets/ab33ede4-8355-4e8c-970e-e31972efe6be)

![image](https://github.com/user-attachments/assets/d782c86d-bd50-456d-a32f-892d5fb00abd)

![image](https://github.com/user-attachments/assets/530bcd43-0584-4429-94a3-e283a1be2deb)

![image](https://github.com/user-attachments/assets/eb27bd43-6f48-402b-ba6d-f444f091e720)


### HQ-CLI
````
kinit Administrator
````

````
id
````

````
klist
````

````
apt-get install -y admc
````
⚠️Если не работает то ⚠️
````
nano /etc/krb5.conf
````
![image](https://github.com/user-attachments/assets/c2d2d432-cf84-4dad-b251-a0dc3d5a9f36)

ПИШЕМ 
````
admc
````
Создаем пять юзеров ⚠️
![image](https://github.com/user-attachments/assets/5874f564-7f1e-42b9-9a59-82c31209d9a5)
![image](https://github.com/user-attachments/assets/3af57a4c-27ab-4f24-98c9-29604a177cea)


После идем в cmd

````
nano /etc/sudoers 
````
Пишем в конце
````
%hq ALL=(ALL) NOPASSWD: /bin/cat, /bin/grep, /usr/bin/id
````

### HQ-SRV MDADM

````
lsblk
````

````
apt-update && apt install mdadm
````

````
lsblk
````

````
mdadm --create --verbose /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd
````

````
cat /proc/mdstat
````


````
mdadm --detail --scan | tee -a /etc/mdadm.conf
````

````
mkfs.ext4 /dev/md0
````

````
mkdir -p /raid5
````

````
mount -a
````

````
apt update && apt install -y nfs-kernel-server
````

````
mkdir -p /raid5/nfs
````

````
chmod 777 /raid/nfs
````
Отредачить Exports

````
nano /etc/exports
````

Добавить строку

````
/raid5/nfs *(rw,sync,no_subtree_check)
````

Применить

````
exportfs -ra
````

````
systemctl restart nfs-kernel-server
````

### Hq-cli Монтирование

cmd

````
mkdir -p /mnt/nfs
````

Добавить строку

````
nano /etc/fstab
````
````
hq-srv.au-team.irpo:/raid5/nfs /mnt/nfs nfs defaults 0 0
````

````
df -h | grep /mnt/nfs
````


### Chrony server HQ-RTR 

````
apt install -y chrony
````

````
nano /etc/chrony/chrony.conf
````

Коментим 
````
#pool 2.debian.pool.ntp.org iburst
````
Добовляем

````
server 127.0.0.1 iburst prefer
hwtimestamp *
local stratum 5
allow 0/0
````
> ***Примечание:*** где: server 127.0.0.1 iburst prefer - указываем сервером синхронизации самого себя, 
опция «iburst» принудительно отправляет сразу несколько пакетов для точности синхронизации, 
опция «prefer» говорит о том, что это будет предпочитаемый сервер; 
hwtimestamp * - опция, чтобы сетевой интерфейс считал собственный источник времени верным и синхронизировал клиентов с ним; 
local stratum 5 - устанавливаем для себя значение по stratum = 5; 
allow - кому разрешается подключаться к серверу и запрашивать время: чтобы не перечеслять все используемые в задании IPv4 и IPv6 сети, используется 0/0 и ::/0; 
(закомментированный блок писать не надо, как пример описание всех используемых в задании сетей) • Запускаем и добавляем в автозагрузку службу chronyd: И не забываем рестартать сервис
.

````
systemctl enable --now chrony
````


````
systemctl restart chrony
````

````
chronyc sources
````

### Chrony client  HQ-SRV BR-SRV BR-RTR:

````
apt install -y chrony
````

````
nano /etc/chrony/chrony.conf
````

Коментим 
````
#pool 2.debian.pool.ntp.org iburst
````
Пишем 
````
server 192.168.100.1 iburst prefer
````
> ***Примечание:*** где:
192.168.100.1 - IPv4 адрес HQ-R;

````
systemctl enable --now chrony
````


````
systemctl restart chrony
````

НА HQ-RTR ПИШЕМ
````
chronyc clients
````

### Ansible BR-SRV

````
apt update && apt install -y ansible
````
Создаем папку !!
````
mkdir -p /etc/ansible
````
Создаем конфиг
````
nano /etc/ansible/hosts
````
Пишем в конфиг
````
[hq]
HQ-SRV ansible_host=hq-srv.au-team.irpo
HQ-CLI ansible_host=hq-cli.au-team.irpo
HQ-RTR ansible_host=hq-rtr.au-team.irpo

[br]
BR-RTR ansible_host=br-rtr.au-team.irpo

````

### SSH  
⚠️nameserver везде сделать 192.168.100.2⚠️

BR-SRV
````
ssh-keygen -t rsa -b 2048
````
Копируем ssh-key
````
ssh-copy-id hq-rtr.au-team.irpo
````

````
ssh-copy-id hq-srv.au-team.irpo
````

````
ssh-copy-id hq-cli.au-team.irpo
````

````
ssh-copy-id br-rtr.au-team.irpo
````

### тесты ansible
br-srv
````
ansible all -m ping
````
![image](https://github.com/user-attachments/assets/919bbb55-f321-491a-b181-9880f793cccc)
ждем такой ответ

### Docker BR-SRV moodle
````
apt update && apt install -y docker.io docker-compose
````

````
systemctl enable --now docker.service
````

Создаем авто деплой
````
nano ~/wiki.yml
````
КОНФИГ WIKI.YML
````
version: '3'
services:
  MediaWiki:
    container_name: wiki
    image: mediawiki
    restart: always
    ports:
      - 8000:80
    links:
      - database
    volumes:
      - images:/var/www/html/images
      # - ./LocalSettings.php:/var/www/html/LocalSettings.php

  database:
    container_name: db
    image: mariadb
    restart: always
    environment:
      MYSQL_DATABASE: mediawiki
      MYSQL_USER: wiki
      MYSQL_PASSWORD: DEP@ssw0rd
      MYSQL_RANDOM_ROOT_PASSWORD: 'yes'
    volumes:
      - dbvolume:/var/lib/mariadb

volumes:
  images:
  dbvolume:
    external: true
````

Устоновка СУБД

````
apt install –y mariadb-*
````

````
docker volume create dbvolume 
````

````
docker-compose -f wiki.yml up -d
````
Проверка
````
docker ps
````
MediaWiki должна быть доступна извне через порт 8080 HQ-R: 
#### Идем на hq-cli все еще wiki
cmd
````
nano /etc/hosts
````
делаем локальный dns
````
192.168.200.2 mediawiki.au-team.irpo mdeiawiki
````

чапаем в браузер легендарную лису 
и тут такая возня
http://mediawiki.au-team.irpo:8080

![image](https://github.com/user-attachments/assets/93398004-e81d-43b2-9369-eaaa1ad26723)
![image](https://github.com/user-attachments/assets/29e02fc8-0924-43f1-abef-805bb58cc3c5)

> ***Примечание:*** • Заполняем параметры подключение к Базе Данных в соответствие с заданными переменными окружения в wiki.yml, которые соответствуют требованиям задания:

![image](https://github.com/user-attachments/assets/3549e834-368d-4aa1-9702-70153914ede0)

![image](https://github.com/user-attachments/assets/efbcfebc-c36d-4d7e-9eac-24ebae3ba651)


Заполняем необходимые сведения
![image](https://github.com/user-attachments/assets/8264beb1-9a87-4fc4-8b8d-6eea10f15d6d)

![image](https://github.com/user-attachments/assets/bfe6f4bc-5870-4854-bac2-dbf87f0ab16b)
> ***Примечание:*** • После чего будет автоматически скачен файл LocalSettings.php - который необходимо передать на HQ-SRV в домашнюю директорию пользователя root туда же где лежим wiki.yml:

![image](https://github.com/user-attachments/assets/8bb073f5-cf39-4136-8931-c47c050a5c78)

 Забираем файл LocalSettings.php с CLI: scp 
user@192.168.10.2:~/Download/LocalSettings.php


![image](https://github.com/user-attachments/assets/a643d3b9-1761-4393-9e91-0a13727f0950)


• Передаём его на HQ-SRV: scp LocalSettings.php admin@11.11.11.11:/tmp HQ-SRV: • Проверяем:
````
ls /tmp/
````
Ответ такой : LocalSettings.php

Пишем 
````
pwd
````

````
ls
````
ответ : LocalSettings.php , Tmp, wiki.yml

Идем в wiki.yml
````
nano ~/wiki.yml
````
Нужно ракоментить
````
# - ./LocalSettings.php:/var/wwww/html/LocalSettings.php
````
Убираем #
Перезапускаем сервисы средствами docker-compose: 

````
docker-compose -f wiki.yml stop
````

````
docker-compose -f wiki.yml up -d
````

Идем на Cli
Чекаем как там вики
https://wiki.au-team.irpo:8080
• вход из под пользователя wiki с паролем WikiP@ssw0rd:


### BR-RTR NFTABLES
````
nano /etc/nftables.conf
````

редачим вот так
![image](https://github.com/user-attachments/assets/7dbad745-d340-4485-8cdb-e80205fd5c25)

add

````
chain prerouting {
   type nat hook postrouting priority filter: policy accept
   ip daddr 172.16.5.2 tcp dport 2024 dnat ip to 192.168.200.2:2024
   ip daddr 172.16.5.2 tcp dport 80 dnat ip to 192.168.200.2:8080
}
````

### HQ-RTR NFTABLES
![image](https://github.com/user-attachments/assets/8bdd450c-c02a-453d-af69-9e96b6f2ecd0)
````
chain prerouting {
   type nat hook postrouting priority filter: policy accept
   ip daddr 172.16.4.1 tcp dport 2024 dnat ip to 192.168.100.2:2024}
````

### HQ-SRV MOODLE

````
apt install -y apache* -y
````

````
apt install -y php php8.2 php-curl php-zip php-xml libapache2-mod-php php-mysql php-mbstring php-gd php-intl php-soap -y
````

#### moodle mysql субд так же hq-srv
````
apt install -y mariadb-* -y
````
ребут services
````
systemctl enable --now mariadb
````

````
systemctl enable --now apache2
````
Создаем бд
````
mysql
````
CREATE DATABASE moodledb DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

````
CREATE USER 'moodle'@'localhost' IDENTIFIED BY 'P@ssw0rd';
````

````
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,CREATE TEMPORARY TABLES,DROP,INDEX,ALTER ON moodle.* TO 'moodle'@'localhost';
````

````
EXIT;
````

#### git MOODLE
````
apt update && apt install -y git
````
Дергаем модуль
````
git clone git://git.moodle.org/moodle.git
````

````
cd moodle
````

````
git branch -a
````
![image](https://github.com/user-attachments/assets/5eb29c5a-83f6-493d-8718-4b3a35ed11e0)

````
git branch --track MOODLE_403_STABLE origin/MOODLE_403_STABLE 
````
проверяем: 
````
git checkout MOODLE_403_STABLE
````
![image](https://github.com/user-attachments/assets/f51bb72e-50da-4c6d-a334-c0b1b613e496)


• Копируем локальный репозиторий в /var/www/html/: cd ../ cp -R moodle /var/www/html/ 

````
 cd ../
````

````
cp -R moodle /var/www/html/ 
````
Права и патапочки
````
mkdir /var/moodledata 
````

````
chown -R www-data /var/moodledata 
````

````
chmod -R 777 /var/moodledata 
````

````
chmod -R 0755 /var/www/html/moodle 
````

````
chown -R www-data:www-data /var/www/html/moodle 
````

#### Настройка апачиии 

````
nano /etc/apache2/sites-available/moodle.conf
````
Конфиг апача
````
<VirtualHost *:80>
    ServerName au-team.irpo
    ServerAlias moodle.au-team.irpo
    DocumentRoot /var/www/html/moodle

    <Directory "/var/www/html/moodle">
        AllowOverride All
        Options -Indexes +FollowSymLinks
    </Directory>
</VirtualHost>
````
> ***Примечание:*** где: ServerName - основное имя домена 
ServerAlias - дополнительное имя, по которому будет доступен сайт 
DocumentRoot - путь до проекта для этого домена AllowOverride All - когда сервер находит .htaccess файл (как определено AccessFileName) ему необходимо знать какие директивы, объявленные в том файле могут отменять ранее утановленную информацию доступа. Эта директива может быть установлена в None, т.е. чтобы сервер не читал файл .htaccess. Если она установленна в All - сервер будет допускать все директивы .htaccess файла. 
Options -Indexes +FollowSymLinks - означает, что если каталог является символьной ссылкой, перейдите по ссылке 


 Создаём символьную ссылку из sites-available на sites-enabled:

````
ln -s /etc/apache2/sites-available/moodle.conf /etc/sites-enabled/ 
````
• Проверяем синтаксис файла виртуального хоста: 
````
apachectl configtest
````

Ждем ответа 
Syntax OK

Правим количество входных переменных, которые могут быть приняты в одном запросе, для работы Moodle - необходимо 5000, а значение в php.ini по умолчанию 1000: 

````
sed -i "s/; max_input_vars = 1000/max_input_vars = 5000/g" /etc/php/8.0/apache2-mod_php/php.ini
````

После можно переходить в браузер для установки Moodle по http://<IP | domain-name>/install.php 


o Открываем firefox переходим на http://moodle.au-team.irpo/moodle  - выбираем Язык - нажимаем Далее:

![image](https://github.com/user-attachments/assets/047595c9-0b88-4ee1-8da9-8659bca1bed9)

![image](https://github.com/user-attachments/assets/a82a0714-d3ad-4cde-ae1b-f303e6a932d7)


• Выбираем драйвер баз данных MariaDB - нажимаем Далее:


![image](https://github.com/user-attachments/assets/b2a88d46-e422-4ef0-9838-83ba53de946f)


Заполняем параметры ранее созданной Базы данных - пользователя БД, пароль и порт:
ИМЯ БАЗЫ ДАННЫХ moodledb
ПОЛЬЗОВАТЕЛЬ moodle
ПАРОЛЬ P@ssw0rd

• нажимаем Продолжить:

![image](https://github.com/user-attachments/assets/3bf5c815-e1f7-4c95-a1e8-3bf7ec5fdf17)


• Нажимаем Продолжить: o к настройке HTTPS можно вернуться после настройки Центра Сертификации

![image](https://github.com/user-attachments/assets/89a0d574-eef7-477c-a2d4-139f0a12d68e)

• заполняем необходимые сведения и нажимаем Обновить профиль:

![image](https://github.com/user-attachments/assets/7cd829c6-874b-47fd-ad8d-e0fe40c62277)
![image](https://github.com/user-attachments/assets/40affca6-c281-4add-a75c-fad231cbec9b)

Заполняем необходимые сведения и нажимаем Сохранить изменения
![image](https://github.com/user-attachments/assets/f9ea6862-f906-4e4b-91f3-428cc531b56c)
![image](https://github.com/user-attachments/assets/5df25eb3-0c44-454d-b40a-b75174b7f278)


#### Настройте веб-сервер nginx как обратный прокси-сервер на HQ-RTR 

• При обращении к HQ-RTR по доменному имени moodle.au-team.irpo клиента должно перенаправлять на HQ-SRV на стандартный порт, на сервис moodle 
• При обращении к HQ-RTR по доменному имени wiki. au-team.irpo клиента должно перенаправлять на BR-SRV на порт, на сервис mediwiki

HQ-RTR
````
apt update && apt install -y nginx
````

````
systemctl start nginx
````

````
systemctl enable nginx
````

Откройте новый файл конфигурации для настройки виртуальных хостов:

````
nano /etc/nginx/sites-available/reverse-proxy.conf
````
Добавьте настройки для проксирования запросов :
Добавьте конфигурацию в файл reverse-proxy.conf:
![image](https://github.com/user-attachments/assets/03394497-d493-471f-a6ad-a24c833968b8)

•  Создайте символическую ссылку на этот файл в папке sites-enabled для активации конфигурации:

````
ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/
````
Проверка синткс
````
nginx -t
````
Ждем типо  лялял лял ял л syntax OK 
 если гуд то 

````
systemctl reload nginx
````

#### бРАУЗЕР ЯД HQ-CLI
 9. Удобным способом установите приложение Яндекс Браузере для организаций на HQ-CLI 
• Установку браузера отметьте в отчёте
cmd
````
apt-get install yandex-browser-stable
````
![image](https://github.com/user-attachments/assets/e7f09f65-25b9-43c5-9c70-02cf37d5ca26)

