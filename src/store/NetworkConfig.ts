import { defineStore } from 'pinia';

interface NetworkConfig {
  domain: {
    name: string;
    dns: string;
  };
  hqRtr: {
    hostname: string;
    ens18: { ip: string; netmask: string; network: string };
    ens19: { ip: string; netmask: string; network: string };
    gateway: string;
    tun0: { ip: string };
    packages: {
      frr: boolean;
      nftables: boolean;
      iscDhcp: boolean;
      chrony: boolean; // server
      sudo: boolean;
    };
  };
  brRtr: {
    hostname: string;
    ens18: { ip: string; netmask: string; network: string };
    ens19: { ip: string; netmask: string; network: string };
    gateway: string;
    tun0: { ip: string };
    packages: {
      frr: boolean;
      nftables: boolean;
      chrony: boolean; // client
      sudo: boolean;
    };
  };
  hqSrv: {
    hostname: string;
    ip: string;
    netmask: string;
    gateway: string;
    packages: {
      opensshServer: boolean;
      opensshClient: boolean;
      dnsmasq: boolean;
      mdadm: boolean;
      nfsKernelServer: boolean;
      mariadb: boolean;
      apache2: boolean;
      php: boolean; // и другие модули
      git: boolean;
      chrony: boolean; // client
    };
  };
  brSrv: {
    hostname: string;
    ip: string;
    netmask: string;
    gateway: string;
    packages: {
      samba: boolean;
      krb5: boolean;
      winbind: boolean;
      smbclient: boolean;
      ansible: boolean;
      dockerIo: boolean;
      dockerCompose: boolean;
      chrony: boolean; // client
    };
  };
  hqCli: {
    network: string;
    dhcpRange: string;
    packages: {
      admc: boolean;
      yandexBrowserStable: boolean;
    };
  };
  accounts: {
    sshUser: { username: string; password: string };
    netAdmin: { username: string; password: string };
  };
}

export const useNetworkConfigStore = defineStore('networkConfig', {
  state: () => ({
    config: {
      domain: { name: 'au-team.irpo', dns: '' },
      hqRtr: {
        hostname: 'hq-rtr',
        ens18: { ip: '172.16.4.2/28', netmask: '', network: '172.16.4.1' },
        ens19: { ip: '', netmask: '', network: '192.168.100.1/26' },
        gateway: '',
        tun0: { ip: '' },
        packages: {
          frr: false,
          nftables: false,
          iscDhcp: false,
          chrony: true, // server
          sudo: false,
        }
      },
      brRtr: {
        hostname: '',
        ens18: { ip: '', netmask: '', network: '' },
        ens19: { ip: '', netmask: '', network: '' },
        gateway: '',
        tun0: { ip: '' },
        packages: {
          frr: false,
          nftables: false,
          chrony: true, // client
          sudo: false,
        }
      },
      hqSrv: {
        hostname: '',
        ip: '',
        netmask: '',
        gateway: '',
        packages: {
          opensshServer: false,
          opensshClient: false,
          dnsmasq: false,
          mdadm: false,
          nfsKernelServer: false,
          mariadb: false,
          apache2: false,
          php: false, // и другие модули
          git: false,
          chrony: true, // client
        }
      },
      brSrv: {
        hostname: '',
        ip: '',
        netmask: '',
        gateway: '',
        packages: {
          samba: false,
          krb5: false,
          winbind: false,
          smbclient: false,
          ansible: false,
          dockerIo: false,
          dockerCompose: false,
          chrony: true, // client
        }
      },
      hqCli: {
        network: '',
        dhcpRange: '',
        packages: {
          admc: false,
          yandexBrowserStable: false,
        }
      },
      accounts: {
        sshUser: { username: '', password: '' },
        netAdmin: { username: '', password: '' }
      }
    } as NetworkConfig
  }),
  actions: {
    updateConfig(newConfig: NetworkConfig) {
      this.config = newConfig;
    },
    resetConfig() {
      this.config = {
        domain: { name: 'example.com', dns: '' },
        hqRtr: {
          hostname: '',
          ens18: { ip: '', netmask: '', network: '' },
          ens19: { ip: '', netmask: '', network: '' },
          gateway: '',
          tun0: { ip: '' },
          packages: {
            frr: false,
            nftables: false,
            iscDhcp: false,
            chrony: true, // server
            sudo: false,
          }
        },
        brRtr: {
          hostname: '',
          ens18: { ip: '', netmask: '', network: '' },
          ens19: { ip: '', netmask: '', network: '' },
          gateway: '',
          tun0: { ip: '' },
          packages: {
            frr: false,
            nftables: false,
            chrony: true, // client
            sudo: false,
          }
        },
        hqSrv: {
          hostname: '',
          ip: '',
          netmask: '',
          gateway: '',
          packages: {
            opensshServer: false,
            opensshClient: false,
            dnsmasq: false,
            mdadm: false,
            nfsKernelServer: false,
            mariadb: false,
            apache2: false,
            php: false, // и другие модули
            git: false,
            chrony: true, // client
          }
        },
        brSrv: {
          hostname: '',
          ip: '',
          netmask: '',
          gateway: '',
          packages: {
            samba: false,
            krb5: false,
            winbind: false,
            smbclient: false,
            ansible: false,
            dockerIo: false,
            dockerCompose: false,
            chrony: true, // client
          }
        },
        hqCli: {
          network: '',
          dhcpRange: '',
          packages: {
            admc: false,
            yandexBrowserStable: false,
          }
        },
        accounts: {
          sshUser: { username: '', password: '' },
          netAdmin: { username: '', password: '' }
        }
      };
    }
  }
});
