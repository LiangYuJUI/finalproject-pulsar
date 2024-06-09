import dgram from "dgram";
const socket = dgram.createSocket('udp4');
const port = 514;
const address = '192.168.3.111';   // NAS Address in local network

/*
 - Facility:
    0 kernel messages
    1 user-level messages
    2 mail system
    3 system daemons
    4 security/authorization messages
    5 messages generated internally by syslogd
    6 line printer subsystem
    7 network news subsystem
    8 UUCP subsystem
    9 clock daemon
    10 security/authorization messages
    11 FTP daemon
    12 NTP subsystem
    13 log audit
    14 log alert
    15 clock daemon
    16 local use 0 (local0)
    17 local use 1 (local1)
    18 local use 2 (local2)
    19 local use 3 (local3)
    20 local use 4 (local4)
    21 local use 5 (local5)
    22 local use 6 (local6)
    23 local use 7 (local7)

 - Log Level: 
    0 Emergency
    1 Alert
    2 Critical
    3 Error
    4 Warning
    5 Notice
    6 Informational
    7 Debug

    <${Facility*8 + Level}>
*/
export default  async (facility, level, host, processName, message) => {
    try {
        const now = new Date();
        const monthNames = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(now);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        const formattedDateTime = `${monthNames} ${day} ${hours}:${minutes}:${seconds}`;

        const msg = `<${facility*8+level}>${formattedDateTime} ${host} ${processName} ${message}`;
        console.log(msg);
        // socket.send(Buffer.from(msg), port, address, (err) => {
        //     if (err) {
        //         console.log(`Error: ${err}`);
        //     } else {
        //         console.log('Message sent successfully!');
        //     }
        // });
    }
    catch (error) {
        console.error(error);
    } 
    finally {

    }
}