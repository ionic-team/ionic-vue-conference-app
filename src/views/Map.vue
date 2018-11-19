<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-label>Map Style</ion-label>
        <!-- alert, popover, action-sheet -->
        <ion-select placeholder="Select One" ok-text="Okay" cancel-text="Dismiss" interface="action-sheet">
          <ion-select-option value="satellite">Satellite</ion-select-option>
          <ion-select-option value="terrain">Terrain</ion-select-option>
          <ion-select-option value="traffic">Traffic</ion-select-option>
        </ion-select>
      </ion-item>
    </ion-content>
  </div>
</template>
