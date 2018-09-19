import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {loadScript} from '../../service/util';

@Directive({
  selector: '[yc-map]',
  exportAs: 'ycMap'
})
export class MapDirective implements OnInit {

  key = 'cca72e3e21736febbf596a86e25c63a5';
  map;
  contextMenu;

  @Output('pushCoordinate') pushCoordinate = new EventEmitter<any>();
  @Output('removeCoordinate') removeCoordinate = new EventEmitter<any>();

  constructor(private ref: ElementRef,
              private renderer: Renderer2) {
    this.contextMenu = new AMap.ContextMenu();  //创建右键菜单
    this.contextMenu.addItem('删除标记', (e) => {
      let marker = this.marker_only[0];
      if (marker) {
        let {lng, lat} = marker.getPosition();
        this.removeCoordinate.emit({
          coords: {
            longitude: lng,
            latitude: lat,
          }
        });
        this.map.remove(marker);
      }
    }, 0);
  }

  marker = [
    {'longitude': '116.433118', 'latitude': '39.878338', 'radius': '1159'}, {
      'longitude': '116.424985',
      'latitude': '39.884285',
      'radius': '528'
    }, {'longitude': '116.437351', 'latitude': '39.886399', 'radius': '328'}, {
      'longitude': '116.40998',
      'latitude': '39.881506',
      'radius': '1308'
    }, {'longitude': '116.419052', 'latitude': '39.892496', 'radius': '422'}, {
      'longitude': '116.439703',
      'latitude': '39.894767',
      'radius': '1837'
    }, {'longitude': '116.429134', 'latitude': '39.896916', 'radius': '871'}, {
      'longitude': '116.425667',
      'latitude': '39.89762',
      'radius': '1233'
    }, {'longitude': '116.428436', 'latitude': '39.904988', 'radius': '745'}, {
      'longitude': '116.416065',
      'latitude': '39.905162',
      'radius': '1190'
    }, {'longitude': '116.412715', 'latitude': '39.911949', 'radius': '633'}, {
      'longitude': '116.416467',
      'latitude': '39.925155',
      'radius': '957'
    }, {'longitude': '116.416703', 'latitude': '39.918349', 'radius': '897'}, {
      'longitude': '116.430556',
      'latitude': '39.924182',
      'radius': '643'
    }, {'longitude': '116.434946', 'latitude': '39.941622', 'radius': '1193'}, {
      'longitude': '116.420551',
      'latitude': '39.959336',
      'radius': '1581'
    }, {'longitude': '116.405008', 'latitude': '39.948986', 'radius': '1304'}, {
      'longitude': '116.42093',
      'latitude': '39.942019',
      'radius': '919'
    }, {'longitude': '116.426037', 'latitude': '39.931808', 'radius': '789'}, {
      'longitude': '116.408118',
      'latitude': '39.93864',
      'radius': '914'
    }, {'longitude': '116.396055', 'latitude': '39.944349', 'radius': '587'}, {
      'longitude': '116.396501',
      'latitude': '39.934316',
      'radius': '684'
    }, {'longitude': '116.403108', 'latitude': '39.926085', 'radius': '405'}, {
      'longitude': '116.398394',
      'latitude': '39.895335',
      'radius': '1316'
    }, {'longitude': '116.401846', 'latitude': '39.891798', 'radius': '1384'}, {
      'longitude': '116.399481',
      'latitude': '39.873047',
      'radius': '1282'
    }, {'longitude': '116.401958', 'latitude': '39.862812', 'radius': '488'}, {
      'longitude': '116.428765',
      'latitude': '39.935855',
      'radius': '0'
    }, {'longitude': '116.43142', 'latitude': '39.94101', 'radius': '0'}, {
      'longitude': '116.4241220000',
      'latitude': '39.9249940000',
      'radius': '10000'
    }, {'longitude': '116.4264280000', 'latitude': '39.9032460000', 'radius': '10000'}, {
      'longitude': '116.4173940000',
      'latitude': '39.9177850000',
      'radius': '10000'
    }, {'longitude': '116.386751', 'latitude': '39.943417', 'radius': '615'}, {
      'longitude': '116.387742',
      'latitude': '39.940567',
      'radius': '1052'
    }, {'longitude': '116.381118', 'latitude': '39.953549', 'radius': '799'}, {
      'longitude': '116.375377',
      'latitude': '39.945182',
      'radius': '531'
    }, {'longitude': '116.365908', 'latitude': '39.940572', 'radius': '1049'}, {
      'longitude': '116.37114',
      'latitude': '39.923963',
      'radius': '1083'
    }, {'longitude': '116.373336', 'latitude': '39.909485', 'radius': '700'}, {
      'longitude': '116.39286',
      'latitude': '39.884017',
      'radius': '663'
    }, {'longitude': '116.382957', 'latitude': '39.902873', 'radius': '733'}, {
      'longitude': '116.385226',
      'latitude': '39.887946',
      'radius': '321'
    }, {'longitude': '116.381056', 'latitude': '39.87586', 'radius': '806'}, {
      'longitude': '116.372115',
      'latitude': '39.897429',
      'radius': '1003'
    }, {'longitude': '116.37372', 'latitude': '39.88465', 'radius': '826'}, {
      'longitude': '116.354697',
      'latitude': '39.871419',
      'radius': '386'
    }, {'longitude': '116.355507', 'latitude': '39.878161', 'radius': '912'}, {
      'longitude': '116.364413',
      'latitude': '39.886288',
      'radius': '420'
    }, {'longitude': '116.358613', 'latitude': '39.883556', 'radius': '769'}, {
      'longitude': '116.352218',
      'latitude': '39.874066',
      'radius': '500'
    }, {'longitude': '116.330211', 'latitude': '39.881186', 'radius': '1054'}, {
      'longitude': '116.334475',
      'latitude': '39.878735',
      'radius': '1209'
    }, {'longitude': '116.344944', 'latitude': '39.884832', 'radius': '1084'}, {
      'longitude': '116.346367',
      'latitude': '39.893809',
      'radius': '545'
    }, {'longitude': '116.362945', 'latitude': '39.894431', 'radius': '616'}, {
      'longitude': '116.353088',
      'latitude': '39.89875',
      'radius': '746'
    }, {'longitude': '116.351936', 'latitude': '39.906725', 'radius': '1459'}, {
      'longitude': '116.36265',
      'latitude': '39.915291',
      'radius': '841'
    }, {'longitude': '116.351457', 'latitude': '39.914445', 'radius': '663'}, {
      'longitude': '116.340842',
      'latitude': '39.932944',
      'radius': '1298'
    }, {'longitude': '116.354666', 'latitude': '39.923085', 'radius': '876'}, {
      'longitude': '116.36019',
      'latitude': '39.933277',
      'radius': '645'
    }, {'longitude': '116.345034', 'latitude': '39.927711', 'radius': '1071'}, {
      'longitude': '116.344723',
      'latitude': '39.930314',
      'radius': '769'
    }, {'longitude': '116.350636', 'latitude': '39.917787', 'radius': '652'}, {
      'longitude': '116.340038',
      'latitude': '39.913166',
      'radius': '700'
    }, {'longitude': '116.336427', 'latitude': '39.904153', 'radius': '868'}, {
      'longitude': '116.390223',
      'latitude': '39.954365',
      'radius': '467'
    }, {'longitude': '116.353009', 'latitude': '39.944503', 'radius': '1161'}, {
      'longitude': '116.39271',
      'latitude': '39.895189',
      'radius': '0'
    }, {'longitude': '116.3810690000', 'latitude': '39.9153230000', 'radius': '10000'}, {
      'longitude': '116.3646540000',
      'latitude': '39.9214650000',
      'radius': '10000'
    }, {'longitude': '116.449489', 'latitude': '39.953683', 'radius': '1036'}, {
      'longitude': '116.435251',
      'latitude': '39.954494',
      'radius': '643'
    }, {'longitude': '116.444081', 'latitude': '39.960924', 'radius': '753'}, {
      'longitude': '116.36768',
      'latitude': '40.005611',
      'radius': '782'
    }, {'longitude': '116.381766', 'latitude': '40.013037', 'radius': '3502'}, {
      'longitude': '116.412273',
      'latitude': '39.992395',
      'radius': '554'
    }, {'longitude': '116.405685', 'latitude': '39.985799', 'radius': '1018'}, {
      'longitude': '116.425012',
      'latitude': '40.035752',
      'radius': '2040'
    }, {'longitude': '116.423696', 'latitude': '39.994209', 'radius': '842'}, {
      'longitude': '116.400239',
      'latitude': '40.003131',
      'radius': '202'
    }, {'longitude': '116.443045', 'latitude': '40.02133', 'radius': '3296'}, {
      'longitude': '116.470948',
      'latitude': '39.997493',
      'radius': '2608'
    }, {'longitude': '116.466736', 'latitude': '39.982282', 'radius': '1064'}, {
      'longitude': '116.486355',
      'latitude': '39.984703',
      'radius': '492'
    }, {'longitude': '116.493877', 'latitude': '39.963228', 'radius': '996'}, {
      'longitude': '116.495846',
      'latitude': '39.973128',
      'radius': '2258'
    }, {'longitude': '116.557683', 'latitude': '39.96162', 'radius': '3346'}, {
      'longitude': '116.51625',
      'latitude': '39.942894',
      'radius': '2419'
    }, {'longitude': '116.499969', 'latitude': '39.93474', 'radius': '884'}, {
      'longitude': '116.505589',
      'latitude': '39.922509',
      'radius': '1176'
    }, {'longitude': '116.496163', 'latitude': '39.922619', 'radius': '1151'}, {
      'longitude': '116.5156',
      'latitude': '39.916021',
      'radius': '630'
    }, {'longitude': '116.53127', 'latitude': '39.893176', 'radius': '2944'}, {
      'longitude': '116.489196',
      'latitude': '39.915329',
      'radius': '883'
    }, {'longitude': '116.500867', 'latitude': '39.907831', 'radius': '1387'}, {
      'longitude': '116.489734',
      'latitude': '39.897728',
      'radius': '2410'
    }, {'longitude': '116.498302', 'latitude': '39.881733', 'radius': '2138'}, {
      'longitude': '116.461169',
      'latitude': '39.883737',
      'radius': '1505'
    }, {'longitude': '116.509601', 'latitude': '39.861671', 'radius': '1868'}, {
      'longitude': '116.460726',
      'latitude': '39.876132',
      'radius': '1496'
    }, {'longitude': '116.465992', 'latitude': '39.861379', 'radius': '1524'}, {
      'longitude': '116.448711',
      'latitude': '39.864793',
      'radius': '1018'
    }, {'longitude': '116.456208', 'latitude': '39.892641', 'radius': '1072'}, {
      'longitude': '116.477666',
      'latitude': '39.894921',
      'radius': '1036'
    }, {'longitude': '116.477712', 'latitude': '39.909205', 'radius': '834'}, {
      'longitude': '116.450882',
      'latitude': '39.908411',
      'radius': '1088'
    }, {'longitude': '116.43726', 'latitude': '39.907951', 'radius': '824'}, {
      'longitude': '116.477957',
      'latitude': '39.945755',
      'radius': '1683'
    }, {'longitude': '116.479163', 'latitude': '39.917212', 'radius': '757'}, {
      'longitude': '116.464639',
      'latitude': '39.919858',
      'radius': '754'
    }, {'longitude': '116.47888', 'latitude': '39.928285', 'radius': '747'}, {
      'longitude': '116.471296',
      'latitude': '39.925302',
      'radius': '410'
    }, {'longitude': '116.467171', 'latitude': '39.928545', 'radius': '731'}, {
      'longitude': '116.445221',
      'latitude': '39.931705',
      'radius': '893'
    }, {'longitude': '116.45052', 'latitude': '39.922345', 'radius': '616'}, {
      'longitude': '116.456127',
      'latitude': '39.934122',
      'radius': '924'
    }, {'longitude': '116.457497', 'latitude': '39.95964', 'radius': '1041'}, {
      'longitude': '116.462083',
      'latitude': '39.950339',
      'radius': '799'
    }, {'longitude': '116.465093', 'latitude': '39.946816', 'radius': '1508'}, {
      'longitude': '116.443225',
      'latitude': '39.968186',
      'radius': '1210'
    }, {'longitude': '116.452284', 'latitude': '39.975564', 'radius': '1483'}, {
      'longitude': '116.435961',
      'latitude': '39.982974',
      'radius': '811'
    }, {'longitude': '116.423867', 'latitude': '39.983117', 'radius': '865'}, {
      'longitude': '116.412515',
      'latitude': '39.980233',
      'radius': '528'
    }, {'longitude': '116.400998', 'latitude': '39.969561', 'radius': '873'}, {
      'longitude': '116.463953',
      'latitude': '39.824856',
      'radius': '1751'
    }, {'longitude': '116.380391', 'latitude': '39.988246', 'radius': '815'}, {
      'longitude': '116.556683',
      'latitude': '39.916674',
      'radius': '1345'
    }, {'longitude': '116.583584', 'latitude': '39.896698', 'radius': '2590'}, {
      'longitude': '116.586096',
      'latitude': '39.917465',
      'radius': '1927'
    }, {'longitude': '116.599386', 'latitude': '39.932263', 'radius': '2247'}, {
      'longitude': '116.601869',
      'latitude': '40.069518',
      'radius': '4389'
    }, {'longitude': '116.413469', 'latitude': '40.053985', 'radius': '1344'}, {
      'longitude': '116.447998',
      'latitude': '39.922152',
      'radius': '0'
    }, {'longitude': '116.4814660000', 'latitude': '39.9152770000', 'radius': '10000'}, {
      'longitude': '116.4576990000',
      'latitude': '39.9284330000',
      'radius': '10000'
    }, {'longitude': '116.430411', 'latitude': '39.86264', 'radius': '1178'}, {
      'longitude': '116.444384',
      'latitude': '39.84559',
      'radius': '1540'
    }, {'longitude': '116.400905', 'latitude': '39.83577', 'radius': '1910'}, {
      'longitude': '116.421169',
      'latitude': '39.805446',
      'radius': '1003'
    }, {'longitude': '116.401968', 'latitude': '39.814961', 'radius': '1119'}, {
      'longitude': '116.430458',
      'latitude': '39.848399',
      'radius': '936'
    }, {'longitude': '116.420707', 'latitude': '39.855879', 'radius': '874'}, {
      'longitude': '116.410993',
      'latitude': '39.8561',
      'radius': '675'
    }, {'longitude': '116.417683', 'latitude': '39.86699', 'radius': '629'}, {
      'longitude': '116.4009',
      'latitude': '39.856179',
      'radius': '910'
    }, {'longitude': '116.391695', 'latitude': '39.857411', 'radius': '912'}, {
      'longitude': '116.376008',
      'latitude': '39.844113',
      'radius': '1594'
    }, {'longitude': '116.383531', 'latitude': '39.857612', 'radius': '898'}, {
      'longitude': '116.375931',
      'latitude': '39.84546',
      'radius': '907'
    }, {'longitude': '116.355492', 'latitude': '39.843026', 'radius': '1525'}, {
      'longitude': '116.342533',
      'latitude': '39.845432',
      'radius': '1303'
    }, {'longitude': '116.367098', 'latitude': '39.869956', 'radius': '1569'}, {
      'longitude': '116.34525',
      'latitude': '39.863891',
      'radius': '1263'
    }, {'longitude': '116.310455', 'latitude': '39.813785', 'radius': '5237'}, {
      'longitude': '116.287773',
      'latitude': '39.828251',
      'radius': '1279'
    }, {'longitude': '116.286418', 'latitude': '39.809492', 'radius': '1548'}, {
      'longitude': '116.281961',
      'latitude': '39.855433',
      'radius': '848'
    }, {'longitude': '116.293936', 'latitude': '39.866926', 'radius': '1312'}, {
      'longitude': '116.235371',
      'latitude': '39.855971',
      'radius': '3214'
    }, {'longitude': '116.252964', 'latitude': '39.857347', 'radius': '1212'}, {
      'longitude': '116.314017',
      'latitude': '39.867828',
      'radius': '1304'
    }, {'longitude': '116.317465', 'latitude': '39.88472', 'radius': '816'}, {
      'longitude': '116.318853',
      'latitude': '39.891133',
      'radius': '2121'
    }, {'longitude': '116.322652', 'latitude': '39.894565', 'radius': '586'}, {
      'longitude': '116.308083',
      'latitude': '39.88229',
      'radius': '1341'
    }, {'longitude': '116.278173', 'latitude': '39.877121', 'radius': '899'}, {
      'longitude': '116.268908',
      'latitude': '39.877224',
      'radius': '537'
    }, {'longitude': '116.265101', 'latitude': '39.888833', 'radius': '1026'}, {
      'longitude': '116.341537',
      'latitude': '39.814377',
      'radius': '2044'
    }, {'longitude': '116.198104', 'latitude': '39.831258', 'radius': '3255'}, {
      'longitude': '116.160929',
      'latitude': '39.809284',
      'radius': '1247'
    }, {'longitude': '116.3287400000', 'latitude': '39.9008750000', 'radius': '10000'}, {
      'longitude': '116.4048010000',
      'latitude': '39.8644490000',
      'radius': '10000'
    }, {'longitude': '116.23778', 'latitude': '39.910749', 'radius': '1219'}, {
      'longitude': '116.222419',
      'latitude': '39.913437',
      'radius': '1159'
    }, {'longitude': '116.230116', 'latitude': '39.901971', 'radius': '1722'}, {
      'longitude': '116.202199',
      'latitude': '39.916047',
      'radius': '1235'
    }, {'longitude': '116.183664', 'latitude': '39.909657', 'radius': '1473'}, {
      'longitude': '116.219045',
      'latitude': '39.8907',
      'radius': '1392'
    }, {'longitude': '116.193669', 'latitude': '39.923786', 'radius': '796'}, {
      'longitude': '116.188567',
      'latitude': '39.930042',
      'radius': '1071'
    }, {'longitude': '116.197813', 'latitude': '39.94475', 'radius': '2909'}, {
      'longitude': '116.166558',
      'latitude': '39.927225',
      'radius': '661'
    }, {'longitude': '116.160602', 'latitude': '39.933837', 'radius': '1065'}, {
      'longitude': '116.132335',
      'latitude': '39.956577',
      'radius': '1559'
    }, {'longitude': '116.132175', 'latitude': '39.935959', 'radius': '1077'}, {
      'longitude': '116.322828',
      'latitude': '39.906494',
      'radius': '716'
    }, {'longitude': '116.309431', 'latitude': '39.907488', 'radius': '859'}, {
      'longitude': '116.292756',
      'latitude': '39.908461',
      'radius': '1497'
    }, {'longitude': '116.285964', 'latitude': '39.924176', 'radius': '1033'}, {
      'longitude': '116.274047',
      'latitude': '39.910557',
      'radius': '1385'
    }, {'longitude': '116.330224', 'latitude': '39.925604', 'radius': '447'}, {
      'longitude': '116.322251',
      'latitude': '39.929585',
      'radius': '1067'
    }, {'longitude': '116.311199', 'latitude': '39.924408', 'radius': '912'}, {
      'longitude': '116.308095',
      'latitude': '39.932273',
      'radius': '711'
    }, {'longitude': '116.329749', 'latitude': '39.938194', 'radius': '489'}, {
      'longitude': '116.313455',
      'latitude': '39.943628',
      'radius': '1088'
    }, {'longitude': '116.303997', 'latitude': '39.938672', 'radius': '746'}, {
      'longitude': '116.301739',
      'latitude': '39.946408',
      'radius': '925'
    }, {'longitude': '116.288154', 'latitude': '39.928175', 'radius': '1207'}, {
      'longitude': '116.266036',
      'latitude': '39.918369',
      'radius': '1306'
    }, {'longitude': '116.254606', 'latitude': '39.913146', 'radius': '1861'}, {
      'longitude': '116.24361',
      'latitude': '39.930851',
      'radius': '2755'
    }, {'longitude': '116.379125', 'latitude': '39.96896', 'radius': '998'}, {
      'longitude': '116.367221',
      'latitude': '39.960323',
      'radius': '1824'
    }, {'longitude': '116.368279', 'latitude': '39.953728', 'radius': '678'}, {
      'longitude': '116.353225',
      'latitude': '39.969953',
      'radius': '849'
    }, {'longitude': '116.373536', 'latitude': '39.979444', 'radius': '730'}, {
      'longitude': '116.352816',
      'latitude': '39.992303',
      'radius': '1803'
    }, {'longitude': '116.368385', 'latitude': '39.994363', 'radius': '818'}, {
      'longitude': '116.343105',
      'latitude': '39.993531',
      'radius': '1169'
    }, {'longitude': '116.311326', 'latitude': '39.98056', 'radius': '680'}, {
      'longitude': '116.340176',
      'latitude': '39.962582',
      'radius': '705'
    }, {'longitude': '116.344188', 'latitude': '39.962857', 'radius': '680'}, {
      'longitude': '116.316702',
      'latitude': '39.954856',
      'radius': '1034'
    }, {'longitude': '116.31346', 'latitude': '39.949984', 'radius': '547'}, {
      'longitude': '116.284568',
      'latitude': '39.95788',
      'radius': '1260'
    }, {'longitude': '116.326787', 'latitude': '39.967657', 'radius': '841'}, {
      'longitude': '116.335082',
      'latitude': '39.975029',
      'radius': '1527'
    }, {'longitude': '116.294997', 'latitude': '39.996514', 'radius': '839'}, {
      'longitude': '116.207',
      'latitude': '39.992997',
      'radius': '2859'
    }, {'longitude': '116.30171', 'latitude': '39.976613', 'radius': '944'}, {
      'longitude': '116.305099',
      'latitude': '39.977666',
      'radius': '836'
    }, {'longitude': '116.295056', 'latitude': '39.966367', 'radius': '966'}, {
      'longitude': '116.307414',
      'latitude': '39.962692',
      'radius': '757'
    }, {'longitude': '116.342588', 'latitude': '40.036303', 'radius': '2659'}, {
      'longitude': '116.312186',
      'latitude': '40.053049',
      'radius': '1243'
    }, {'longitude': '116.31164', 'latitude': '40.038939', 'radius': '1501'}, {
      'longitude': '116.28486',
      'latitude': '40.027634',
      'radius': '1131'
    }, {'longitude': '116.259007', 'latitude': '40.045247', 'radius': '2635'}, {
      'longitude': '116.339074',
      'latitude': '40.037662',
      'radius': '0'
    }, {'longitude': '116.3277610000', 'latitude': '39.9848920000', 'radius': '10000'}, {
      'longitude': '116.103227',
      'latitude': '39.998459',
      'radius': '1650'
    }, {'longitude': '116.123092', 'latitude': '39.904926', 'radius': '3481'}, {
      'longitude': '116.079028',
      'latitude': '39.937682',
      'radius': '622'
    }, {'longitude': '116.097624', 'latitude': '39.943008', 'radius': '2133'}, {
      'longitude': '116.100198',
      'latitude': '39.951036',
      'radius': '715'
    }, {'longitude': '116.099543', 'latitude': '39.934916', 'radius': '1152'}, {
      'longitude': '116.031572',
      'latitude': '39.890718',
      'radius': '2339'
    }, {'longitude': '116.191305', 'latitude': '39.778218', 'radius': '4760'}, {
      'longitude': '116.147458',
      'latitude': '39.73362',
      'radius': '4057'
    }, {'longitude': '116.082556', 'latitude': '39.716809', 'radius': '2650'}, {
      'longitude': '115.972407',
      'latitude': '39.739552',
      'radius': '3335'
    }, {'longitude': '115.959177', 'latitude': '39.728393', 'radius': '939'}, {
      'longitude': '116.079163',
      'latitude': '39.664034',
      'radius': '2759'
    }, {'longitude': '115.95913', 'latitude': '39.606709', 'radius': '1415'}, {
      'longitude': '116.55634',
      'latitude': '39.753229',
      'radius': '2772'
    }, {'longitude': '116.627595', 'latitude': '39.910337', 'radius': '1640'}, {
      'longitude': '116.647099',
      'latitude': '39.904184',
      'radius': '1123'
    }, {'longitude': '116.661333', 'latitude': '39.90773', 'radius': '491'}, {
      'longitude': '116.663368',
      'latitude': '39.903339',
      'radius': '735'
    }, {'longitude': '116.68244', 'latitude': '39.905153', 'radius': '735'}, {
      'longitude': '116.687106',
      'latitude': '39.89609',
      'radius': '909'
    }, {'longitude': '116.682517', 'latitude': '39.889371', 'radius': '981'}, {
      'longitude': '116.671735',
      'latitude': '39.875665',
      'radius': '1798'
    }, {'longitude': '116.647766', 'latitude': '39.891206', 'radius': '961'}, {
      'longitude': '116.65433',
      'latitude': '39.883247',
      'radius': '873'
    }, {'longitude': '116.682559', 'latitude': '39.877795', 'radius': '677'}, {
      'longitude': '116.695761',
      'latitude': '39.86745',
      'radius': '1141'
    }, {'longitude': '116.703536', 'latitude': '39.849446', 'radius': '2258'}, {
      'longitude': '116.697509',
      'latitude': '39.914266',
      'radius': '1164'
    }, {'longitude': '116.649902', 'latitude': '39.915956', 'radius': '899'}, {
      'longitude': '116.650177',
      'latitude': '39.924265',
      'radius': '1021'
    }, {'longitude': '116.575817', 'latitude': '40.050111', 'radius': '2878'}, {
      'longitude': '116.524106',
      'latitude': '40.108284',
      'radius': '3811'
    }, {'longitude': '116.655742', 'latitude': '40.055467', 'radius': '3681'}, {
      'longitude': '116.645302',
      'latitude': '40.106868',
      'radius': '1814'
    }, {'longitude': '116.66351', 'latitude': '40.110466', 'radius': '838'}, {
      'longitude': '116.654478',
      'latitude': '40.121574',
      'radius': '532'
    }, {'longitude': '116.670469', 'latitude': '40.122711', 'radius': '1118'}, {
      'longitude': '116.660525',
      'latitude': '40.128128',
      'radius': '1224'
    }, {'longitude': '116.654245', 'latitude': '40.139388', 'radius': '639'}, {
      'longitude': '116.657227',
      'latitude': '40.171847',
      'radius': '2621'
    }, {'longitude': '116.725023', 'latitude': '40.133265', 'radius': '2731'}, {
      'longitude': '116.342934',
      'latitude': '40.058729',
      'radius': '1956'
    }, {'longitude': '116.33105', 'latitude': '40.08059', 'radius': '3349'}, {
      'longitude': '116.297968',
      'latitude': '40.084284',
      'radius': '1319'
    }, {'longitude': '116.423292', 'latitude': '40.068712', 'radius': '1896'}, {
      'longitude': '116.403077',
      'latitude': '40.059779',
      'radius': '4104'
    }, {'longitude': '116.42313', 'latitude': '40.115193', 'radius': '5264'}, {
      'longitude': '116.372448',
      'latitude': '40.084534',
      'radius': '1510'
    }, {'longitude': '116.29516', 'latitude': '40.134943', 'radius': '7076'}, {
      'longitude': '116.32225',
      'latitude': '40.172066',
      'radius': '2432'
    }, {'longitude': '116.293154', 'latitude': '40.211386', 'radius': '1969'}, {
      'longitude': '116.148976',
      'latitude': '40.138892',
      'radius': '1257'
    }, {'longitude': '116.322382', 'latitude': '40.074651', 'radius': '0'}, {
      'longitude': '116.43634',
      'latitude': '39.792529',
      'radius': '4073'
    }, {'longitude': '116.509901', 'latitude': '39.787609', 'radius': '3959'}, {
      'longitude': '116.341828',
      'latitude': '39.79304',
      'radius': '2271'
    }, {'longitude': '116.364829', 'latitude': '39.796893', 'radius': '412'}, {
      'longitude': '116.336244',
      'latitude': '39.77349',
      'radius': '570'
    }, {'longitude': '116.337604', 'latitude': '39.749555', 'radius': '300'}, {
      'longitude': '116.331606',
      'latitude': '39.749907',
      'radius': '2038'
    }, {'longitude': '116.340246', 'latitude': '39.752034', 'radius': '807'}, {
      'longitude': '116.33166',
      'latitude': '39.729949',
      'radius': '1425'
    }, {'longitude': '116.322836', 'latitude': '39.755234', 'radius': '568'}, {
      'longitude': '116.350015',
      'latitude': '39.72683',
      'radius': '658'
    }, {'longitude': '116.348382', 'latitude': '39.716528', 'radius': '834'}, {
      'longitude': '116.335453',
      'latitude': '39.712423',
      'radius': '1348'
    }, {'longitude': '116.338655', 'latitude': '39.7444', 'radius': '551'}, {
      'longitude': '116.685785',
      'latitude': '40.293099',
      'radius': '1483'
    }, {'longitude': '116.640605', 'latitude': '40.28945', 'radius': '2189'}, {
      'longitude': '116.703731',
      'latitude': '40.321112',
      'radius': '1785'
    }, {'longitude': '116.637897', 'latitude': '40.328686', 'radius': '1198'}, {
      'longitude': '117.01112',
      'latitude': '40.128262',
      'radius': '1777'
    }, {'longitude': '117.111802', 'latitude': '40.139003', 'radius': '2503'}, {
      'longitude': '117.126037',
      'latitude': '40.160145',
      'radius': '2012'
    }, {'longitude': '117.303932', 'latitude': '40.175584', 'radius': '4333'}, {
      'longitude': '117.126859',
      'latitude': '40.281358',
      'radius': '6529'
    }, {'longitude': '117.010516', 'latitude': '40.245325', 'radius': '1366'}];

  markerCache = [];
  arr = [];
  marker_only;

  private _markerList;

  get markerList() {
    return this._markerList;
  }

  @Input() set markerList(value) {
    this._markerList = value;
    if (value instanceof Array) {
      value.map(m => ({lat: m.latitude, lng: m.longitude})).forEach(m => {
        this.markerClickEvent(this.contextMenu, m);
      });
    }
  }

  ngOnInit(): void {
    loadScript(`//webapi.amap.com/maps?v=1.4.8&key=${this.key}`).then(() => {
      AMap.plugin('AMap.Geocoder');
      this.map = new AMap.Map(this.ref.nativeElement, {
        resizeEnable: true,
        center: [116.480983, 39.989628],
        zoom: 11
      });
      //创建右键菜单
      let contextMenu = new AMap.ContextMenu();
      contextMenu.addItem('删除标记', (e) => {
        let marker = this.marker_only[0];
        if (marker) {
          let {lng, lat} = marker.getPosition();
          this.removeCoordinate.emit({
            coords: {
              longitude: lng,
              latitude: lat,
            }
          });
          this.map.remove(marker);
        }
      }, 0);
      // 添加标注
      this.map.on('click', (event) => {
        let {lng, lat} = event.lnglat;
        this.addressByLnglat([lng, lat]).then((result: any) => {
          console.info(result);
          this.pushCoordinate.emit({
            coords: {
              longitude: lng,
              latitude: lat,
              radius: 30,
            },
            type_id: 0,
            id: `80${Math.round(Math.random() * 1000000)}`,
            name: result.regeocode.formattedAddress,
          });
        });
        let marker = this.addMarker(event.lnglat);
        this.markerCache.push(marker);
        this.markerClickEvent(contextMenu, event.lnglat, marker);
      });
    });
  }

  addMarker(lnglat) {
    let {lng, lat} = lnglat;
    return new AMap.Marker({
      map: this.map,
      position: [lng, lat]
    });
  }

  markerClickEvent(contextMenu, lnglat, marker?) {
    if (!marker) {
      marker = this.addMarker(lnglat);
      this.markerCache.push(marker);
    }
    marker.on('rightclick', (event) => {
      this.marker_only = this.markerCache.filter(item => event.target.getId() === item.getId());
      contextMenu.open(this.map, event.lnglat);
      contextMenu.marker = marker;
    });
    marker.on('click', (event) => {
      let {lng, lat} = event.lnglat;
      this.addressByLnglat([lng, lat]).then((result: any) => {
        console.info(result);
        let infoWindow = new AMap.InfoWindow({
          content: ` ${result.regeocode.formattedAddress} `,
          offset: new AMap.Pixel(0, -15),
          position: [lnglat.lng, lnglat.lat]
        });
        infoWindow.open(this.map);
      });
    });
  }

  addressByLnglat(lnglat) {
    return new Promise((resolve, reject) => {
      let geocoder = new AMap.Geocoder();
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          resolve(result);
        }
      });
    });
  }

}
