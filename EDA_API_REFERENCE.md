# EDA Pro API Reference

Auto-generated from @jlceda/pro-api-types

### DMT_Board
createBoard(schematicUuid?: string, pcbUuid?: string): Promise<string | undefined>;
modifyBoardName(originalBoardName: string, boardName: string): Promise<boolean>;
copyBoard(sourceBoardName: string): Promise<string | undefined>;
getBoardInfo(boardName: string): Promise<IDMT_BoardItem | undefined>;
getAllBoardsInfo(): Promise<Array<IDMT_BoardItem>>;
getCurrentBoardInfo(): Promise<IDMT_BoardItem | undefined>;
deleteBoard(boardName: string): Promise<boolean>;

### DMT_EditorControl
openDocument(documentUuid: string, splitScreenId?: string): Promise<string | undefined>;
openLibraryDocument(libraryUuid: string, libraryType: ELIB_LibraryType.SYMBOL | ELIB_LibraryType.FOOTPRINT, uuid: string, splitScreenId?: string): Promise<string | undefined>;
closeDocument(tabId: string): Promise<boolean>;
getSplitScreenTree(): Promise<IDMT_EditorSplitScreenItem | undefined>;
getSplitScreenIdByTabId(tabId: string): Promise<string | undefined>;
getTabsBySplitScreenId(splitScreenId: string): Promise<Array<IDMT_EditorTabItem>>;
createSplitScreen(splitScreenType: EDMT_EditorSplitScreenDirection, tabId: string): Promise<{
moveDocumentToSplitScreen(tabId: string, splitScreenId: string): Promise<boolean>;
activateDocument(tabId: string): Promise<boolean>;
activateSplitScreen(splitScreenId: string): Promise<boolean>;
tileAllDocumentToSplitScreen(): Promise<boolean>;
mergeAllDocumentFromSplitScreen(): Promise<boolean>;
getCurrentRenderedAreaImage(tabId?: string): Promise<Blob | undefined>;
zoomToRegion(left: number, right: number, top: number, bottom: number, tabId?: string): Promise<boolean>;
zoomTo(x?: number, y?: number, scaleRatio?: number, tabId?: string): Promise<{
zoomToAllPrimitives(tabId?: string): Promise<{
zoomToSelectedPrimitives(tabId?: string): Promise<{
removeIndicatorMarkers(tabId?: string): Promise<boolean>;

### DMT_Folder
createFolder(folderName: string, teamUuid: string, parentFolderUuid?: string, description?: string): Promise<string | undefined>;
modifyFolderName(teamUuid: string, folderUuid: string, folderName: string): Promise<boolean>;
modifyFolderDescription(teamUuid: string, folderUuid: string, description?: string): Promise<boolean>;
moveFolderToFolder(teamUuid: string, folderUuid: string, parentFolderUuid?: string): Promise<boolean>;
getAllFoldersUuid(teamUuid: string): Promise<Array<string>>;
getFolderInfo(teamUuid: string, folderUuid: string): Promise<IDMT_FolderItem | undefined>;
deleteFolder(teamUuid: string, folderUuid: string): Promise<boolean>;

### DMT_Panel
createPanel(): Promise<string | undefined>;
modifyPanelName(panelUuid: string, panelName: string): Promise<boolean>;
copyPanel(panelUuid: string): Promise<string | undefined>;
getPanelInfo(panelUuid: string): Promise<IDMT_PanelItem | undefined>;
getAllPanelsInfo(): Promise<Array<IDMT_PanelItem>>;
getCurrentPanelInfo(): Promise<IDMT_PanelItem | undefined>;
deletePanel(panelUuid: string): Promise<boolean>;

### DMT_Pcb
createPcb(boardName?: string): Promise<string | undefined>;
modifyPcbName(pcbUuid: string, pcbName: string): Promise<boolean>;
copyPcb(pcbUuid: string, boardName?: string): Promise<string | undefined>;
getPcbInfo(pcbUuid: string): Promise<IDMT_PcbItem | undefined>;
getAllPcbsInfo(): Promise<Array<IDMT_PcbItem>>;
getCurrentPcbInfo(): Promise<IDMT_PcbItem | undefined>;
deletePcb(pcbUuid: string): Promise<boolean>;

### DMT_Project
openProject(projectUuid: string): Promise<boolean>;
createProject(projectFriendlyName: string, projectName?: string, teamUuid?: string, folderUuid?: string, description?: string, collaborationMode?: EDMT_ProjectCollaborationMode): Promise<string | undefined>;
moveProjectToFolder(projectUuid: string, folderUuid?: string): Promise<boolean>;
getAllProjectsUuid(teamUuid?: string, folderUuid?: string, workspaceUuid?: string): Promise<Array<string>>;
getProjectInfo(projectUuid: string): Promise<IDMT_BriefProjectItem | undefined>;
getCurrentProjectInfo(): Promise<IDMT_ProjectItem | undefined>;

### DMT_Schematic
createSchematic(boardName?: string): Promise<string | undefined>;
createSchematicPage(schematicUuid: string): Promise<string | undefined>;
modifySchematicName(schematicUuid: string, schematicName: string): Promise<boolean>;
modifySchematicPageName(schematicPageUuid: string, schematicPageName: string): Promise<boolean>;
copySchematic(schematicUuid: string, boardName?: string): Promise<string | undefined>;
copySchematicPage(schematicPageUuid: string, schematicUuid?: string): Promise<string | undefined>;
getSchematicInfo(schematicUuid: string): Promise<IDMT_SchematicItem | undefined>;
getSchematicPageInfo(schematicPageUuid: string): Promise<IDMT_SchematicPageItem | undefined>;
getAllSchematicsInfo(): Promise<Array<IDMT_SchematicItem>>;
getAllSchematicPagesInfo(): Promise<Array<IDMT_SchematicPageItem>>;
getCurrentSchematicAllSchematicPagesInfo(): Promise<Array<IDMT_SchematicPageItem>>;
getCurrentSchematicInfo(): Promise<IDMT_SchematicItem | undefined>;
getCurrentSchematicPageInfo(): Promise<IDMT_SchematicPageItem | undefined>;
reorderSchematicPages(schematicUuid: string, schematicPageItemsArray: Array<IDMT_SchematicPageItem>): Promise<boolean>;
deleteSchematic(schematicUuid: string): Promise<boolean>;
deleteSchematicPage(schematicPageUuid: string): Promise<boolean>;

### DMT_SelectControl
getCurrentDocumentInfo(): Promise<IDMT_EditorDocumentItem | undefined>;

### DMT_Team
getAllTeamsInfo(): Promise<Array<IDMT_TeamItem>>;
getAllInvolvedTeamInfo(): Promise<Array<IDMT_TeamItem>>;
getCurrentTeamInfo(): Promise<IDMT_TeamItem | undefined>;

### DMT_Workspace
getAllWorkspacesInfo(): Promise<Array<IDMT_WorkspaceItem>>;
toggleToWorkspace(workspaceUuid?: string): Promise<boolean>;
getCurrentWorkspaceInfo(): Promise<IDMT_WorkspaceItem | undefined>;

### PCB_Document
importChanges(uuid?: string): Promise<boolean>;
importAutoRouteJsonFile(autoRouteFile: File): Promise<boolean>;
importAutoLayoutJsonFile(autoLayoutFile: File): Promise<boolean>;
save(uuid: string): Promise<boolean>;
getCalculatingRatlineStatus(): Promise<EPCB_DocumentRatlineCalculatingActiveStatus>;
startCalculatingRatline(): Promise<boolean>;
stopCalculatingRatline(): Promise<boolean>;
convertCanvasOriginToDataOrigin(x: number, y: number): Promise<{
convertDataOriginToCanvasOrigin(x: number, y: number): Promise<{
getCanvasOrigin(): Promise<{
setCanvasOrigin(offsetX: number, offsetY: number): Promise<boolean>;
navigateToCoordinates(x: number, y: number): Promise<boolean>;
navigateToRegion(left: number, right: number, top: number, bottom: number): Promise<boolean>;
getPrimitiveAtPoint(x: number, y: number): Promise<IPCB_Primitive | undefined>;
getPrimitivesInRegion(left: number, right: number, top: number, bottom: number, leftToRight?: boolean): Promise<Array<IPCB_Primitive>>;
zoomToBoardOutline(): Promise<boolean>;

### PCB_Drc
check(strict: boolean, userInterface: boolean, includeVerboseError: false): Promise<boolean>;
check(strict: boolean, userInterface: boolean, includeVerboseError: true): Promise<Array<any>>;
getCurrentRuleConfigurationName(): Promise<string | undefined>;
getCurrentRuleConfiguration(): Promise<{
getRuleConfiguration(configurationName: string): Promise<{
getAllRuleConfigurations(includeSystem?: boolean): Promise<Array<{
renameRuleConfiguration(originalConfigurationName: string, configurationName: string): Promise<boolean>;
deleteRuleConfiguration(configurationName: string): Promise<boolean>;
getDefaultRuleConfigurationName(): Promise<string | undefined>;
setAsDefaultRuleConfiguration(configurationName: string): Promise<boolean>;
getNetRules(): Promise<Array<{
getNetByNetRules(): Promise<{
getRegionRules(): Promise<Array<{
createNetClass(netClassName: string, nets: Array<string>, color: IPCB_EqualLengthNetGroupItem['color']): Promise<boolean>;
deleteNetClass(netClassName: string): Promise<boolean>;
modifyNetClassName(originalNetClassName: string, netClassName: string): Promise<boolean>;
addNetToNetClass(netClassName: string, net: string | Array<string>): Promise<boolean>;
removeNetFromNetClass(netClassName: string, net: string | Array<string>): Promise<boolean>;
getAllNetClasses(): Promise<Array<IPCB_NetClassItem>>;
createDifferentialPair(differentialPairName: string, positiveNet: string, negativeNet: string): Promise<boolean>;
deleteDifferentialPair(differentialPairName: string): Promise<boolean>;
modifyDifferentialPairName(originalDifferentialPairName: string, differentialPairName: string): Promise<boolean>;
modifyDifferentialPairPositiveNet(differentialPairName: string, positiveNet: string): Promise<boolean>;
modifyDifferentialPairNegativeNet(differentialPairName: string, negativeNet: string): Promise<boolean>;
getAllDifferentialPairs(): Promise<Array<IPCB_DifferentialPairItem>>;
createEqualLengthNetGroup(equalLengthNetGroupName: string, nets: Array<string>, color: IPCB_EqualLengthNetGroupItem['color']): Promise<boolean>;
deleteEqualLengthNetGroup(equalLengthNetGroupName: string): Promise<boolean>;
modifyEqualLengthNetGroupName(originalEqualLengthNetGroupName: string, equalLengthNetGroupName: string): Promise<boolean>;
addNetToEqualLengthNetGroup(equalLengthNetGroupName: string, net: string | Array<string>): Promise<boolean>;
removeNetFromEqualLengthNetGroup(equalLengthNetGroupName: string, net: string | Array<string>): Promise<boolean>;
getAllEqualLengthNetGroups(): Promise<Array<IPCB_EqualLengthNetGroupItem>>;
createPadPairGroup(padPairGroupName: string, padPairs: Array<[string, string]>): Promise<boolean>;
deletePadPairGroup(padPairGroupName: string): Promise<boolean>;
modifyPadPairGroupName(originalPadPairGroupName: string, padPairGroupName: string): Promise<boolean>;
addPadPairToPadPairGroup(padPairGroupName: string, padPair: [string, string] | Array<[string, string]>): Promise<boolean>;
removePadPairFromPadPairGroup(padPairGroupName: string, padPair: [string, string] | Array<[string, string]>): Promise<boolean>;
getAllPadPairGroups(): Promise<Array<IPCB_PadPairGroupItem>>;
getPadPairGroupMinWireLength(padPairGroupName: string): Promise<Array<IPCB_PadPairMinWireLengthItem>>;

### PCB_Layer
selectLayer(layer: TPCB_LayersInTheSelectable): Promise<boolean>;
setLayerVisible(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>, setOtherLayerInvisible?: boolean): Promise<boolean>;
setLayerInvisible(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>, setOtherLayerVisible?: boolean): Promise<boolean>;
lockLayer(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>): Promise<boolean>;
unlockLayer(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>): Promise<boolean>;
setTheNumberOfCopperLayers(numberOfLayers: 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32): Promise<boolean>;
setLayerColorConfiguration(colorConfiguration: EPCB_LayerColorConfiguration): Promise<boolean>;
setInactiveLayerTransparency(transparency: number): Promise<boolean>;
setPcbType(pcbType: EPCB_PcbPlateType): Promise<boolean>;
addCustomLayer(): Promise<TPCB_LayersOfCustom | undefined>;
removeLayer(layer: TPCB_LayersOfCustom): Promise<boolean>;
getAllLayers(): Promise<Array<IPCB_LayerItem>>;
setInactiveLayerDisplayMode(displayMode?: EPCB_InactiveLayerDisplayMode): Promise<boolean>;

### PCB_Net
getAllNetsName(): Promise<Array<string>>;
getAllNetName(): Promise<Array<string>>;
getNetLength(net: string): Promise<number | undefined>;
getAllPrimitivesByNet(net: string, primitiveTypes?: Array<EPCB_PrimitiveType>): Promise<Array<IPCB_Primitive>>;
selectNet(net: string): Promise<boolean>;
highlightNet(net: string): Promise<boolean>;
unhighlightNet(net: string): Promise<boolean>;
getNetlist(type?: ESYS_NetlistType): Promise<string>;
setNetlist(type: ESYS_NetlistType | undefined, netlist: string): Promise<boolean>;

### PCB_PrimitiveComponent
delete(primitiveIds: string | IPCB_PrimitiveComponent | Array<string> | Array<IPCB_PrimitiveComponent>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveComponent | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveComponent>>;
getAllPrimitiveId(layer?: TPCB_LayersOfComponent, primitiveLock?: boolean): Promise<Array<string>>;
getAll(layer?: TPCB_LayersOfComponent, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveComponent>>;
getAllPinsByPrimitiveId(primitiveId: string): Promise<Array<IPCB_PrimitiveComponentPad> | undefined>;

### PCB_PrimitivePad
create(layer: TPCB_LayersOfPad, padNumber: string, x: number, y: number, rotation?: number, pad?: TPCB_PrimitivePadShape, net?: string, hole?: TPCB_PrimitivePadHole | null, holeOffsetX?: number, holeOffsetY?: number, holeRotation?: number, metallization?: boolean, padType?: EPCB_PrimitivePadType, specialPad?: TPCB_PrimitiveSpecialPadShape, solderMaskAndPasteMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null, heatWelding?: IPCB_PrimitivePadHeatWelding | null, primitiveLock?: boolean): Promise<IPCB_PrimitivePad | undefined>;
delete(primitiveIds: string | IPCB_PrimitivePad | Array<string> | Array<IPCB_PrimitivePad>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitivePad | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePad>>;
getAllPrimitiveId(layer?: TPCB_LayersOfPad, net?: string, primitiveLock?: boolean, padType?: EPCB_PrimitivePadType): Promise<Array<string>>;
getAll(layer?: TPCB_LayersOfPad, net?: string, primitiveLock?: boolean, padType?: EPCB_PrimitivePadType): Promise<Array<IPCB_PrimitivePad>>;

### PCB_PrimitiveVia
create(net: string, x: number, y: number, holeDiameter: number, diameter: number, viaType?: EPCB_PrimitiveViaType, designRuleBlindViaName?: string | null, solderMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null, primitiveLock?: boolean): Promise<IPCB_PrimitiveVia | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveVia | Array<string> | Array<IPCB_PrimitiveVia>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveVia | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveVia>>;
getAllPrimitiveId(net?: string, primitiveLock?: boolean): Promise<Array<string>>;
getAll(net?: string, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveVia>>;

### PCB_PrimitiveRegion
create(layer: TPCB_LayersOfRegion, complexPolygon: IPCB_Polygon, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, regionName?: string, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveRegion | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveRegion | Array<string> | Array<IPCB_PrimitiveRegion>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveRegion | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveRegion>>;
getAllPrimitiveId(layer?: TPCB_LayersOfRegion, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, primitiveLock?: boolean): Promise<Array<string>>;
getAll(layer?: TPCB_LayersOfRegion, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveRegion>>;

### PCB_PrimitiveDimension
create(dimensionType: EPCB_PrimitiveDimensionType, coordinateSet: TPCB_PrimitiveDimensionCoordinateSet, layer?: TPCB_LayersOfDimension, unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.CENTIMETER | ESYS_Unit.INCH | ESYS_Unit.MIL, lineWidth?: number, precision?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveDimension | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveDimension | Array<string> | Array<IPCB_PrimitiveDimension>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveDimension | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveDimension>>;
getAllPrimitiveId(layer?: TPCB_LayersOfDimension, primitiveLock?: boolean): Promise<Array<string>>;
getAll(layer?: TPCB_LayersOfDimension, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveDimension>>;

### PCB_PrimitiveLine
create(net: string, layer: TPCB_LayersOfLine, startX: number, startY: number, endX: number, endY: number, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveLine | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveLine | Array<string> | Array<IPCB_PrimitiveLine>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveLine | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveLine>>;
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<string>>;
getAll(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveLine>>;

### PCB_PrimitiveArc
create(net: string, layer: TPCB_LayersOfLine, startX: number, startY: number, endX: number, endY: number, arcAngle: number, lineWidth?: number, interactiveMode?: EPCB_PrimitiveArcInteractiveMode, primitiveLock?: boolean): Promise<IPCB_PrimitiveArc | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveArc | Array<string> | Array<IPCB_PrimitiveArc>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveArc | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveArc>>;
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<string>>;
getAll(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveArc>>;

### PCB_PrimitiveFill
create(layer: TPCB_LayersOfFill, complexPolygon: IPCB_Polygon, net?: string, fillMode?: EPCB_PrimitiveFillMode, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveFill | undefined>;
delete(primitiveIds: string | IPCB_PrimitiveFill | Array<string> | Array<IPCB_PrimitiveFill>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitiveFill | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveFill>>;
getAllPrimitiveId(layer?: TPCB_LayersOfFill, net?: string, primitiveLock?: boolean): Promise<Array<string>>;
getAll(layer?: TPCB_LayersOfFill, net?: string, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveFill>>;

### PCB_PrimitivePolyline
create(net: string, layer: TPCB_LayersOfLine, polygon: IPCB_Polygon, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitivePolyline | undefined>;
delete(primitiveIds: string | IPCB_PrimitivePolyline | Array<string> | Array<IPCB_PrimitivePolyline>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitivePolyline | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePolyline>>;
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<string>>;
getAll(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<IPCB_PrimitivePolyline>>;

### PCB_PrimitivePour
create(net: string, layer: TPCB_LayersOfCopper, complexPolygon: IPCB_Polygon, pourFillMethod?: EPCB_PrimitivePourFillMethod, preserveSilos?: boolean, pourName?: string, pourPriority?: number, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitivePour | undefined>;
delete(primitiveIds: string | IPCB_PrimitivePour | Array<string> | Array<IPCB_PrimitivePour>): Promise<boolean>;
get(primitiveIds: string): Promise<IPCB_PrimitivePour | undefined>;
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePour>>;
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfCopper, primitiveLock?: boolean): Promise<Array<string>>;
getAll(net?: string, layer?: TPCB_LayersOfCopper, primitiveLock?: boolean): Promise<Array<IPCB_PrimitivePour>>;

### PCB_SelectControl
getAllSelectedPrimitives_PrimitiveId(): Promise<Array<string>>;
getAllSelectedPrimitives(): Promise<Array<IPCB_Primitive>>;
getSelectedPrimitives(): Promise<Array<Object>>;
doSelectPrimitives(primitiveIds: string | Array<string>): Promise<boolean>;
doCrossProbeSelect(components?: Array<string>, pins?: Array<string>, nets?: Array<string>, highlight?: boolean, select?: boolean): Promise<boolean>;
clearSelected(): Promise<boolean>;
getCurrentMousePosition(): Promise<{

### SCH_Document
importChanges(): Promise<boolean>;
save(): Promise<boolean>;

### SCH_Drc
check(strict?: boolean, userInterface?: boolean): Promise<boolean>;

### SCH_Netlist
getNetlist(type?: ESYS_NetlistType): Promise<string>;
setNetlist(type: ESYS_NetlistType | undefined, netlist: string): Promise<void>;

### SCH_PrimitiveComponent
createNetFlag(identification: 'Power' | 'Ground' | 'AnalogGround' | 'ProtectGround', net: string, x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent | undefined>;
createNetPort(direction: 'IN' | 'OUT' | 'BI', net: string, x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent | undefined>;
createShortCircuitFlag(x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveComponent | Array<string> | Array<ISCH_PrimitiveComponent>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveComponent | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveComponent>>;
getAllPrimitiveId(componentType?: ESCH_PrimitiveComponentType, allSchematicPages?: boolean): Promise<Array<string>>;
getAll(componentType?: ESCH_PrimitiveComponentType, allSchematicPages?: boolean): Promise<Array<ISCH_PrimitiveComponent>>;
getAllPinsByPrimitiveId(primitiveId: string): Promise<Array<ISCH_PrimitiveComponentPin> | undefined>;
getAllPropertyNames(): Promise<string[]>;

### SCH_PrimitiveWire
create(line: Array<number> | Array<Array<number>>, net?: string, color?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null): Promise<ISCH_PrimitiveWire | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveWire | Array<string> | Array<ISCH_PrimitiveWire>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveWire | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveWire>>;
getAllPrimitiveId(net?: string | Array<string>): Promise<Array<string>>;
getAll(net?: string | Array<string>): Promise<Array<ISCH_PrimitiveWire>>;

### SCH_PrimitivePin
create(x: number, y: number, pinNumber: string, pinName?: string, rotation?: number, pinLength?: number, pinColor?: string | null, pinShape?: ESCH_PrimitivePinShape, pinType?: ESCH_PrimitivePinType): Promise<ISCH_PrimitivePin | undefined>;
delete(primitiveIds: string | ISCH_PrimitivePin | Array<string> | Array<ISCH_PrimitivePin>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitivePin | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitivePin>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitivePin>>;

### SCH_PrimitiveText
create(x: number, y: number, content: string, rotation?: number, textColor?: string | null, fontName?: string | null, fontSize?: number | null, bold?: boolean, italic?: boolean, underLine?: boolean, alignMode?: number): Promise<ISCH_PrimitiveText | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveText | Array<string> | Array<ISCH_PrimitiveText>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveText | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveText>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitiveText>>;

### SCH_PrimitiveArc
create(startX: number, startY: number, referenceX: number, referenceY: number, endX: number, endY: number, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null): Promise<ISCH_PrimitiveArc | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveArc | Array<string> | Array<ISCH_PrimitiveArc>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveArc | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveArc>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitiveArc>>;

### SCH_PrimitiveBus
create(busName: string, line: Array<number> | Array<Array<number>>, color?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null): Promise<ISCH_PrimitiveBus | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveBus | Array<string> | Array<ISCH_PrimitiveBus>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveBus | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveBus>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitiveBus>>;

### SCH_PrimitiveCircle
create(centerX: number, centerY: number, radius: number, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null, fillStyle?: ESCH_PrimitiveFillStyle | null): Promise<ISCH_PrimitiveCircle>;
delete(primitiveIds: string | ISCH_PrimitiveCircle | Array<string> | Array<ISCH_PrimitiveCircle>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveCircle | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveCircle>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitiveCircle>>;

### SCH_PrimitivePolygon
create(line: Array<number>, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null): Promise<ISCH_PrimitivePolygon | undefined>;
delete(primitiveIds: string | ISCH_PrimitivePolygon | Array<string> | Array<ISCH_PrimitivePolygon>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitivePolygon | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitivePolygon>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitivePolygon>>;

### SCH_PrimitiveRectangle
create(topLeftX: number, topLeftY: number, width: number, height: number, cornerRadius?: number, rotation?: number, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null, fillStyle?: ESCH_PrimitiveFillStyle | null): Promise<ISCH_PrimitiveRectangle | undefined>;
delete(primitiveIds: string | ISCH_PrimitiveRectangle | Array<string> | Array<ISCH_PrimitiveRectangle>): Promise<boolean>;
get(primitiveIds: string): Promise<ISCH_PrimitiveRectangle | undefined>;
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveRectangle>>;
getAllPrimitiveId(): Promise<Array<string>>;
getAll(): Promise<Array<ISCH_PrimitiveRectangle>>;

### SCH_SelectControl
getAllSelectedPrimitives_PrimitiveId(): Promise<Array<string>>;
getAllSelectedPrimitives(): Promise<Array<ISCH_Primitive>>;
getSelectedPrimitives_PrimitiveId(): Promise<Array<string>>;
getSelectedPrimitives(): Promise<Array<Object>>;
doSelectPrimitives(primitiveIds: string | Array<string>): Promise<boolean>;
getCurrentMousePosition(): Promise<{

### SYS_Environment
setKeepProjectHasOnlyOneBoard(status?: boolean): Promise<void>;

### SYS_FileManager
getProjectFile(fileName?: string, password?: string, fileType?: '.epro' | '.epro2'): Promise<File | undefined>;
getDocumentFile(fileName?: string, password?: string, fileType?: '.epro' | '.epro2'): Promise<File | undefined>;
getDocumentSource(): Promise<string | undefined>;
getDocumentFootprintSources(): Promise<Array<{
setDocumentSource(source: string): Promise<boolean>;
getProjectFileByProjectUuid(projectUuid: string, fileName?: string, password?: string, fileType?: '.epro' | '.epro2'): Promise<File | undefined>;
getDeviceFileByDeviceUuid(deviceUuid: string | Array<string>, libraryUuid?: string): Promise<File | undefined>;
getFootprintFileByFootprintUuid(footprintUuid: string | Array<string>, libraryUuid?: string): Promise<File | undefined>;
getPanelLibraryFileByPanelLibraryUuid(panelLibraryUuid: string | Array<string>, libraryUuid?: string): Promise<File | undefined>;

### LIB_Device
delete(deviceUuid: string, libraryUuid: string): Promise<boolean>;
get(deviceUuid: string, libraryUuid?: string): Promise<ILIB_DeviceItem | undefined>;
copy(deviceUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex, newDeviceName?: string): Promise<string | undefined>;
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex, symbolType?: ELIB_SymbolType, itemsOfPage?: number, page?: number): Promise<Array<ILIB_DeviceSearchItem>>;
getByLcscIds(lcscIds: Array<string>, libraryUuid?: string, allowMultiMatch?: boolean): Promise<Array<ILIB_DeviceSearchItem>>;

### LIB_Symbol
create(libraryUuid: string, symbolName: string, classification?: ILIB_ClassificationIndex, symbolType?: ELIB_SymbolType, description?: string): Promise<string | undefined>;
delete(symbolUuid: string, libraryUuid: string): Promise<boolean>;
modify(symbolUuid: string, libraryUuid: string, symbolName?: string, classification?: ILIB_ClassificationIndex | null, description?: string | null): Promise<boolean>;
updateDocumentSource(symbolUuid: string, libraryUuid: string, documentSource: string): Promise<boolean | undefined>;
get(symbolUuid: string, libraryUuid?: string): Promise<ILIB_SymbolItem | undefined>;
copy(symbolUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex, newSymbolName?: string): Promise<string | undefined>;
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex, symbolType?: ELIB_SymbolType, itemsOfPage?: number, page?: number): Promise<Array<ILIB_SymbolSearchItem>>;
openInEditor(symbolUuid: string, libraryUuid: string, splitScreenId?: string): Promise<string | undefined>;

### LIB_Footprint
create(libraryUuid: string, footprintName: string, classification?: ILIB_ClassificationIndex, description?: string): Promise<string | undefined>;
delete(footprintUuid: string, libraryUuid: string): Promise<boolean>;
modify(footprintUuid: string, libraryUuid: string, footprintName?: string, classification?: ILIB_ClassificationIndex | null, description?: string | null): Promise<boolean>;
updateDocumentSource(footprintUuid: string, libraryUuid: string, documentSource: string): Promise<boolean | undefined>;
get(footprintUuid: string, libraryUuid?: string): Promise<ILIB_FootprintItem | undefined>;
copy(footprintUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex, newFootprintName?: string): Promise<string | undefined>;
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex, itemsOfPage?: number, page?: number): Promise<Array<ILIB_FootprintSearchItem>>;
openInEditor(footprintUuid: string, libraryUuid: string, splitScreenId?: string): Promise<string | undefined>;

### LIB_LibrariesList
getSystemLibraryUuid(): Promise<string | undefined>;
getPersonalLibraryUuid(): Promise<string | undefined>;
getProjectLibraryUuid(): Promise<string | undefined>;
getFavoriteLibraryUuid(): Promise<string | undefined>;
getAllLibrariesList(): Promise<Array<ILIB_LibraryInfo>>;
