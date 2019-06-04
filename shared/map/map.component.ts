import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GEO_PIN } from '@assets/images/map/svg-paths';
import { Region } from '@services/channel-map.service';
import { loadModules } from 'esri-loader';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

export class ArcgisSvgSymbolSettings {
  public setPath: string; // must be an SVG path
  public setStyle: 'circle' | 'square' | 'cross' | 'x' | 'kite';
  public setColor: { r: number, g: number, b: number, a: number, }; // must be a css rgb/rgba value
  public setSize?: number; // must be a number (will be calculated in 'px' by ArcGIS). 16px is default.
}

export class GeoCenterSettings {
  public latitude: number;
  public longitude: number;
  public zoom?: number;
  public addPin?: boolean;
}

@Component({
  selector: 'xm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private options = {
    url: 'https://js.arcgis.com/3.27/'
  };

  private map: any;
  private addPin: Function;
  private addLine: Function;
  private centerAndZoom: Function;
  private updateMap: Function;
  private mp: any;

  private mapEnabled$ = new BehaviorSubject<boolean>(false);
  private locations$ = new BehaviorSubject<Region[]>([]);
  private showLayers$ = new BehaviorSubject<boolean>(true);
  private center$ = new BehaviorSubject<GeoCenterSettings>(null);
  private subs: Subscription[] = [];

  constructor() { }

  @Input('center')
  set center(center) {
    this.center$.next(center);
  }

  @Input('locations')
  set locations(locations: Region[]) {
    this.locations$.next(locations);
  }

  @Input('mapEnabled')
  set mapEnabled(mapEnabled: boolean) {
    this.mapEnabled$.next(mapEnabled);
  }

  @Input('showLayers')
  set showLayers(showLayers: boolean) {
    this.showLayers$.next(showLayers);
  }

  @Input() automatic = false;

  @Input() connectDots = false;

  private cAndZ(value) {
    Observable.create(ob => ob.next())
      .pipe(delay(500))
      .subscribe(() => {
        if (this.centerAndZoom) {
          this.centerAndZoom(value[0].lat, value[0].lon, 14);
        }
      });
  }

  private createSymbol(symbol, symbolSettings: ArcgisSvgSymbolSettings) {
    const keys = Object.keys(symbolSettings);

    keys.forEach(key => {
      symbol[key](symbolSettings[key]);
    });
  }

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    loadModules(
      [
        'esri/map',
        'esri/geometry/Extent',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/graphic',
        'esri/Color',
        'esri/geometry/Point',
        'esri/geometry/Circle',
        'esri/geometry/Polyline',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/CartographicLineSymbol',
        'esri/symbols/Font',
        'esri/symbols/TextSymbol',
        'esri/geometry/Multipoint',
        'esri/SpatialReference',
        'esri/layers/ImageParameters'
      ],
      this.options
    )
      .then(
        ([
          Map,
          Extent,
          FeatureLayer,
          GraphicsLayer,
          ArcGISDynamicMapServiceLayer,
          Graphic,
          Color,
          Point,
          Circle,
          Polyline,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          PictureMarkerSymbol,
          CartographicLineSymbol,
          Font,
          TextSymbol,
          Multipoint,
          SpatialReference,
          ImageParameters
        ]) => {
          const initExtent = new Extent({
            xmin: -17144000,
            ymin: 842000,
            xmax: -4621000,
            ymax: 8405000,
            spatialReference: {
              wkid: 102100
            }
          });

          // center: [-118, 34.5],
          this.map = new Map('mapDiv', {
            basemap: 'topo', // dark-gray
            extent: initExtent,
            fitExtent: this.automatic,
            logo: false,
            fadeOnZoom: true,
            force3DTransforms: true,
            navigationMode: 'css-transforms',
            optimizePanAnimation: true
          });

          const imageParameters = new ImageParameters();
          imageParameters.format = 'png32';

          const tombstoneLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_HFC_DATABLOCK/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 10000
            }
          );

          const cableLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_RF_CABLE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 20000
            }
          );

          const activeLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_RF_ACTIVE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 20000
            }
          );

          const tapLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_RF_TAP/MapServer',
            {
              useMapImage: false,
              imageFormat: 'png32',
              maxScale: 0,
              minScale: 20000
            }
          );

          const passiveLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_RF_PASSIVE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 20000
            }
          );

          const strandLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_STRAND/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 50000
            }
          );

          const supportLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_SUPPORT_STRUCTURE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 50000
            }
          );

          const powersupplyLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_RF_POWERSUPPLY/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 50000
            }
          );

          const nodeSiteLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_NODE_SITE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 20000
            }
          );

          const nodeBLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_Boundary/CC_SNET_NODE_BNDY/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 2500000
            }
          );

          const fiberLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_FIBER_CABLE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 2500000
            }
          );

          const fiberSpliceLayer = new ArcGISDynamicMapServiceLayer(
            'https://gis-b2-3.cable.comcast.com/arcgis/rest/services/CC_SNET_HFCNetwork/CC_SNET_FIBER_SPLICE/MapServer',
            {
              useMapImage: false,
              imageParameters: imageParameters,
              maxScale: 0,
              minScale: 2500000
            }
          );

          const graphicsLayer = new GraphicsLayer();

          const listOfLayer = [
            cableLayer,
            activeLayer,
            passiveLayer,
            tapLayer,
            powersupplyLayer,
            nodeSiteLayer,
            strandLayer,
            supportLayer,
            fiberLayer,
            fiberSpliceLayer,
            nodeBLayer,
            tombstoneLayer
          ];

          this.updateMap = () => {
            if (this.map && this.mp) {
              let extent = this.mp.getExtent();
              if (extent) {
                this.map.setExtent(extent, true);
              }
            }
          };

          this.map.addLayer(graphicsLayer);

          this.subs.push(
            this.showLayers$.subscribe(showLayers => {
              if (showLayers) {
                this.map.addLayers(listOfLayer);
              } else {
                listOfLayer.forEach(layer => {
                  // test to ensure only listOfLayer added layers are removed.
                  if (layer.url) {
                    this.map.removeLayer(layer);
                  }
                });
              }
            })
          );

          this.addPin = (region: Region) => {
            let line = new SimpleLineSymbol().setWidth(0.75).setStyle(SimpleLineSymbol.STYLE_NULL);
            let pinSymbol = new SimpleMarkerSymbol().setOutline(line);

            if (region.symbol) {
              region.symbol.setColor = new Color(region.symbol.setColor);
              this.createSymbol(pinSymbol, region.symbol);
            } else {
              pinSymbol.setColor(new Color([255, 30, 30, 1])).setPath(GEO_PIN).setSize(40);
            }
            pinSymbol.setStyle(SimpleMarkerSymbol.STYLE_PATH);

            if (!region.lon && !region.lat) {
              return;
            }
            let pt = new Point(region.lon, region.lat);
            graphicsLayer.add(new Graphic(pt, pinSymbol));
          };

          this.addLine = (region1: Region, region2: Region) => {
            const line = {
              geometry: {
                paths: [
                  [
                    [region1.lon, region1.lat],
                    [region2.lon, region2.lat]
                  ]
                ],
              },
              symbol: {
                color: [0, 0, 0, 128],
                width: 1,
                type: 'esriSLS',
                style: 'esriSLSDash'
              }
            };
            const graphic = new Graphic(line);
            graphicsLayer.add(graphic);
          };

          this.subs.push(
            this.locations$.subscribe(locations => {
              if (locations.length === 1) {
                this.cAndZ(locations);
              } else {
                this.mp = new Multipoint({ points: locations.filter(dGML => dGML.lon && dGML.lat).map(dGML => [dGML.lon, dGML.lat]) });
                graphicsLayer.clear();
                locations.forEach((region: Region, idx: number, arr: Region[]) => {
                  if (this.addPin) {
                    this.addPin(region);
                  }
                  if (this.connectDots && this.addLine && idx !== 0) {
                    this.addLine(arr[idx - 1], arr[idx]);
                  }
                });
                if (this.updateMap) {
                  this.updateMap();
                }
              }
            })
          );

          this.subs.push(
            this.center$.pipe(
              filter(user => user !== null),
            ).subscribe((center: GeoCenterSettings) => {
              if (!center) {
                return;
              }
              if (!center.zoom) {
                center.zoom = 18;
              }
              let pt = new Point(center.longitude, center.latitude);
              if (center.addPin) {
                this.addPin({ lat: center.latitude, lon: center.longitude });
              }
              this.map.centerAndZoom(pt, center.zoom);
            })
          );

          this.subs.push(
            this.mapEnabled$.subscribe(mapEnabled => {
              if (mapEnabled) {
                this.map.enableMapNavigation();
              } else {
                this.map.disableMapNavigation();
              }
            })
          );
        }
      )
      .catch(err => {
        // handle any script or module loading errors
      });
  }

  loadDesignLayers() { }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
