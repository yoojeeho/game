var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var size = cc.winSize;

		// 맵 레이어 생성
		var mapLayer = new cc.Layer();
		mapLayer.setPosition(size.width / 2, size.height / 2);
		this.addChild(mapLayer);

		// 맵 생성
		var map = new cc.TMXTiledMap("map.tmx");
		mapLayer.addChild(map);

		// 아이템 레이어 생성
		var itemLayer = new cc.Layer();
		itemLayer.setPosition(size.width / 2, size.height / 2);
		this.addChild(itemLayer);

		// 아이템 생성
		var item = new cc.Sprite("item.png");
		item.setPosition(cc.p(0, 0));
		itemLayer.addChild(item);

		// 아이템 터치 이벤트 리스너 등록
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var itemSize = target.getContentSize();
				var rect = cc.rect(-itemSize.width / 2, -itemSize.height / 2, itemSize.width, itemSize.height);

				if (cc.rectContainsPoint(rect, locationInNode)) {
					cc.log("아이템을 획득하였습니다!");
					itemLayer.removeChild(target);
					return true;
				}

				return false;
			}
		}, item);

		// 맵 이동 이벤트 리스너 등록
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				return true;
			},
			onTouchMoved: function(touch, event) {
				var target = event.getCurrentTarget();
				var delta = touch.getDelta();
				mapLayer.x += delta.x;
				mapLayer.y += delta.y;
			}
		}, mapLayer);
	}
});

cc.game.onStart = function(){
	cc.view.adjustViewPort(true);
	cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);

	// 리소스 프리로드
	cc.LoaderScene.preload(["map.tmx", "item.png"], function () {
cc.director.runScene(new GameScene());
}, this);
};
cc.game.run();