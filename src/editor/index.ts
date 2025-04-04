import './assets/css/index.css'
import { IEditorData, IEditorOption, IEditorResult } from './interface/Editor'
import { IElement } from './interface/Element'
import { Draw } from './core/draw/Draw'
import { Command } from './core/command/Command'
import { CommandAdapt } from './core/command/CommandAdapt'
import { Listener } from './core/listener/Listener'
import { RowFlex } from './dataset/enum/Row'
import {
  FlexDirection,
  ImageDisplay,
  LocationPosition
} from './dataset/enum/Common'
import { ElementType } from './dataset/enum/Element'
import { formatElementList } from './utils/element'
import { Register } from './core/register/Register'
import { ContextMenu } from './core/contextmenu/ContextMenu'
import {
  IContextMenuContext,
  IRegisterContextMenu
} from './interface/contextmenu/ContextMenu'
import {
  EditorComponent,
  EditorZone,
  EditorMode,
  PageMode,
  PaperDirection,
  WordBreak,
  RenderMode
} from './dataset/enum/Editor'
import { EDITOR_CLIPBOARD, EDITOR_COMPONENT } from './dataset/constant/Editor'
import { IWatermark } from './interface/Watermark'
import {
  ControlIndentation,
  ControlState,
  ControlType
} from './dataset/enum/Control'
import { INavigateInfo } from './core/draw/interactive/Search'
import { Shortcut } from './core/shortcut/Shortcut'
import { KeyMap } from './dataset/enum/KeyMap'
import { BlockType } from './dataset/enum/Block'
import { IBlock } from './interface/Block'
import { ILang } from './interface/i18n/I18n'
import { VerticalAlign } from './dataset/enum/VerticalAlign'
import { TableBorder, TdBorder, TdSlash } from './dataset/enum/table/Table'
import { MaxHeightRatio, NumberType } from './dataset/enum/Common'
import { TitleLevel } from './dataset/enum/Title'
import { ListStyle, ListType } from './dataset/enum/List'
import { ICatalog, ICatalogItem } from './interface/Catalog'
import { Plugin } from './core/plugin/Plugin'
import { UsePlugin } from './interface/Plugin'
import { EventBus } from './core/event/eventbus/EventBus'
import { EventBusMap } from './interface/EventBus'
import { IRangeStyle } from './interface/Listener'
import { Override } from './core/override/Override'
import { LETTER_CLASS } from './dataset/constant/Common'
import { INTERNAL_CONTEXT_MENU_KEY } from './dataset/constant/ContextMenu'
import { IRange } from './interface/Range'
import { deepClone, splitText } from './utils'
import {
  createDomFromElementList,
  getElementListByHTML,
  getTextFromElementList,
  type IGetElementListByHTMLOption
} from './utils/element'
import { BackgroundRepeat, BackgroundSize } from './dataset/enum/Background'
import { TextDecorationStyle } from './dataset/enum/Text'
import { mergeOption } from './utils/option'
import { LineNumberType } from './dataset/enum/LineNumber'
import { AreaMode } from './dataset/enum/Area'
import { IBadge } from './interface/Badge'

export default class Editor {
  public command: Command
  public listener: Listener
  public eventBus: EventBus<EventBusMap>
  public override: Override
  public register: Register
  public destroy: () => void
  public use: UsePlugin

  constructor(
    container: HTMLDivElement,
    data: IEditorData | IElement[],
    options: IEditorOption = {}
  ) {
    // Merge configuration
    const editorOptions = mergeOption(options)
    // Data processing
    data = deepClone(data)
    let headerElementList: IElement[] = []
    let mainElementList: IElement[] = []
    let footerElementList: IElement[] = []
    if (Array.isArray(data)) {
      mainElementList = data
    } else {
      headerElementList = data.header || []
      mainElementList = data.main
      footerElementList = data.footer || []
    }
    const pageComponentData = [
      headerElementList,
      mainElementList,
      footerElementList
    ]
    pageComponentData.forEach(elementList => {
      formatElementList(elementList, {
        editorOptions,
        isForceCompensation: true
      })
    })
    // Initialize listener
    this.listener = new Listener()
    // Initialize event bus
    this.eventBus = new EventBus<EventBusMap>()
    // Initialize override
    this.override = new Override()
    // Initialize draw
    const draw = new Draw(
      container,
      editorOptions,
      {
        header: headerElementList,
        main: mainElementList,
        footer: footerElementList
      },
      this.listener,
      this.eventBus,
      this.override
    )
    // Initialize command
    this.command = new Command(new CommandAdapt(draw))
    // Initialize context menu
    const contextMenu = new ContextMenu(draw, this.command)
    // Initialize shortcut
    const shortcut = new Shortcut(draw, this.command)
    // Initialize register
    this.register = new Register({
      contextMenu,
      shortcut,
      i18n: draw.getI18n()
    })
    // Register destroy method
    this.destroy = () => {
      draw.destroy()
      shortcut.removeEvent()
      contextMenu.removeEvent()
    }
    // Initialize plugin
    const plugin = new Plugin(this)
    this.use = plugin.use.bind(plugin)
  }
}

// Public methods
export {
  splitText,
  createDomFromElementList,
  getElementListByHTML,
  getTextFromElementList
}

// Public constants
export {
  EDITOR_COMPONENT,
  LETTER_CLASS,
  INTERNAL_CONTEXT_MENU_KEY,
  EDITOR_CLIPBOARD
}

// Public enums
export {
  Editor,
  RowFlex,
  VerticalAlign,
  EditorZone,
  EditorMode,
  ElementType,
  ControlType,
  EditorComponent,
  PageMode,
  RenderMode,
  ImageDisplay,
  Command,
  KeyMap,
  BlockType,
  PaperDirection,
  TableBorder,
  TdBorder,
  TdSlash,
  MaxHeightRatio,
  NumberType,
  TitleLevel,
  ListType,
  ListStyle,
  WordBreak,
  ControlIndentation,
  BackgroundRepeat,
  BackgroundSize,
  TextDecorationStyle,
  LineNumberType,
  LocationPosition,
  AreaMode,
  ControlState,
  FlexDirection
}

// Public types
export type {
  IElement,
  IEditorData,
  IEditorOption,
  IEditorResult,
  IContextMenuContext,
  IRegisterContextMenu,
  IWatermark,
  INavigateInfo,
  IBlock,
  ILang,
  ICatalog,
  ICatalogItem,
  IRange,
  IRangeStyle,
  IBadge,
  IGetElementListByHTMLOption
}
