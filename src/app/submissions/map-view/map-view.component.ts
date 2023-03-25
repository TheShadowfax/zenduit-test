import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {SubmissionsService} from "../submissions.service";
import {Subscription} from "rxjs";
import {GoogleMap, MapMarker} from "@angular/google-maps";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy{


  statusMap: any = {
    1: 'Low Risk',
    2: 'Uncompleted',
    3: 'Unassigned'
  }

  markers = new Array<any>();
  subs = new Subscription();
  options = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        maxZoom: 15,
        minZoom: 8,
    };
  selectedIndex = -1;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChildren('submission') mapMarkers!: QueryList<ElementRef>;

  constructor(
      public submissionService: SubmissionsService
  ) {
  }

  data = [] as any[];

  ngOnInit(): void {
    this.submissionService.fetchFirstPage()
      this.subs.add(
          this.submissionService.dataSource$.subscribe((val:any[])=>{
            this.data.push(...val);
            this.data = [...this.data];
              const markers = new Array<any>();
              let newBoundary = new google.maps.LatLngBounds();

              val.forEach((item: any, i) => {
                  const position = {
                      lat: item?.profile?.location?.lat,
                      lng: item?.profile?.location?.long
                  }
                  markers.push(
                      {
                          position,
                          options: {
                              icon:  {
                                  url: "/assets/images/marker.png", // url
                                  scaledSize: new google.maps.Size(50, 50), // scaled size
                                  origin: new google.maps.Point(0,0), // origin
                                  anchor: new google.maps.Point(0, 0) // anchor
                              }
                          },
                          data: {index: i}
                          // icon: {
                          //     anchor: new google.maps.Point(16, 16),
                          //     url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
                          // }
                      }
                  );
                  newBoundary.extend(position);
              });
              this.markers = markers;
              //pan out to set the zoom
              this.map?.fitBounds(newBoundary);
          })
      )
  }

  submissionClickHandler(item: any, index: number) {
      const position = {
          lat: item?.profile?.location?.lat,
          lng: item?.profile?.location?.long
  };
      this.map.panTo(position);
      this.selectedIndex = index;
  }

    openInfo(marker: MapMarker) {
        if (this.mapMarkers.length > 0){
            this.selectedIndex = (marker as any)['data']?.index;
            this.mapMarkers?.toArray().at(this.selectedIndex)?.nativeElement.focus();
            this.mapMarkers?.toArray().at(this.selectedIndex)?.nativeElement.scrollIntoView();
        }
        
    }

    pastDueDate(due: string) {
      return Date.parse(due) < Date.now();
    }


    ngOnDestroy(): void {
        this.subs.unsubscribe()
    }
}
