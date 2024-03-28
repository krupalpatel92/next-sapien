import { ChangeDetectionStrategy, Component, Inject, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputFieldComponent, LibMapsComponent, MAP_CIRCLE_RADIUS_KMS, MapMarkerModel, MapService, MapsAlertModel, PositionModel } from 'nextsapien-component-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('search', { static: false })
  public searchElementRef: InputFieldComponent;
  @ViewChild('libMaps', { static: false })
  private libMaps: LibMapsComponent;

  public disableNotification: FormControl<boolean> = new FormControl(false);
  public enableDrag: FormControl<boolean> = new FormControl(true);
  public searchMapsString: string = '';
  public locationsMarkers: MapMarkerModel[] = [];
  public mapType: google.maps.MapTypeId | undefined;

  public polyOptions: string = "{ polylineOptions: { strokeColor: 'green' } }";
  public initialLocation: PositionModel = {
    lat: 37,
    lng: 74.3095,
  };
  constructor(
    private mapService: MapService,
    @Inject(NgZone) private ngZone: NgZone,
  ) {}

  public initAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.inputFieldRef.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.libMaps.onPlaceChange(autocomplete.getPlace());
      });
    });
  }

  public setMapsSearch(search: string): void {
    this.searchElementRef.inputFieldRef.nativeElement.value = search;
  }

  public onMapLoaded(loaded: boolean): void {
    if (loaded) {
      this.locationsMarkers = [
        this.mapService.buildMapMarker(
          '1',
          'assets/1.png',
          {
            lat: 31.5925,
            lng: 74.3095,
          },
          MAP_CIRCLE_RADIUS_KMS,
          '#custom_pin_maps',
        ),
      ];
      this.initAutocomplete();
      this.mapType = google.maps.MapTypeId.ROADMAP;
    }
  }

  public onMarkerClick(marker: MapMarkerModel): void {
    alert('Marker clicked');
  }

  public onMapClick(event: google.maps.MapMouseEvent): void {
    alert('Map Clicked');
  }

  public mapsAlertsEvent(data: MapsAlertModel): void {
    alert(data.message);
  }
}
