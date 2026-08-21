const fs = require('fs');

let content = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

// Change card UI
const newCard = `<div className="flex flex-row gap-3 sm:gap-4 py-3 relative">
                      {/* Imagen Compacta */}
                      <div 
                        className="w-[72px] h-[72px] sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden shrink-0 cursor-pointer border border-gray-100 flex items-center justify-center p-1 shadow-sm"
                        onClick={() => navigate(\`/producto/\${item.slug}\`)}
                      >
                        <img 
                          src={item.imagenes[0]} 
                          alt={item.nombre} 
                          className={\`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 \${!isItemAvailable ? 'opacity-50 grayscale' : ''}\`} 
                        />
                      </div>

                      {/* Información del Producto */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Header del item: Nombre y Eliminar */}
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="flex flex-col min-w-0 pr-2">
                            <h3 
                              className="text-[12px] sm:text-sm font-bold text-mare-navy truncate cursor-pointer hover:text-mare-green leading-tight"
                              onClick={() => navigate(\`/producto/\${item.slug}\`)}
                            >
                              {item.nombre}
                            </h3>
                            {item.selectedVariantName && (
                              <span className="text-[10px] font-bold text-gray-400 mt-0.5 truncate">
                                {item.selectedVariantName}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleRemove(itemId, item.nombre)}
                            className="p-1.5 -m-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 strokeWidth={1.5} className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Detalles de Precio y Cantidad - Lineal y Compacto */}
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-black text-mare-navy leading-none">
                              {formatPrice((item.isWholesale && item.ventaMayorista ? item.ventaMayorista.precioMN : pricing.finalPrice) * item.quantity)}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                              {formatPrice(item.isWholesale && item.ventaMayorista ? item.ventaMayorista.precioMN : pricing.finalPrice)} {item.isWholesale ? 'p/v' : 'u'}
                            </span>
                          </div>
                          
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg h-7 shadow-sm">
                            <button
                              onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= (item.isWholesale && item.ventaMayorista ? item.ventaMayorista.cantidadMinima : 1) || !isItemAvailable}
                              className="w-7 h-full flex items-center justify-center rounded-l-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 transition-colors text-mare-navy"
                            >
                              <Minus strokeWidth={2.5} className="w-2.5 h-2.5" />
                            </button>
                            <div className="px-2 min-w-[24px] h-full flex items-center justify-center border-x border-gray-100 bg-gray-50/50">
                              <span className="text-[11px] font-black text-mare-navy">
                                {item.quantity}
                              </span>
                            </div>
                            <button
                              onClick={() => updateQuantity(itemId, item.quantity + 1)}
                              disabled={!isItemAvailable}
                              className="w-7 h-full flex items-center justify-center rounded-r-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 transition-colors text-mare-navy"
                            >
                              <Plus strokeWidth={2.5} className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                        
                        {!isItemAvailable && (
                          <div className="mt-2">
                            <span className="text-[8px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-red-100">
                              Agotado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>`;

content = content.replace(/<div className="flex flex-row gap-3 sm:gap-5 group relative py-3">[\s\S]*?\{\/\* Detalles de Precio y Cantidad \- Lineal y Compacto \*\/\}[\s\S]*?<\/div>\s*<\/div>/, newCard);
content = content.replace(/\{index < items\.length - 1 && <div className="w-full border-b border-gray-50 my-1"><\/div>\}/g, '{index < items.length - 1 && <div className="w-full border-b border-dashed border-gray-200 my-1"></div>}');

// Make summary cleaner
const newSummary = `<div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <h2 className="text-[11px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
                RESUMEN
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Productos ({totalItems})</span>
                  <span className="font-black text-mare-navy">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="w-full border-b border-dashed border-gray-200 my-2"></div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Entrega</span>
                  {deliveryCost > 0 ? (
                    <span className="font-black text-mare-navy">{formatPrice(deliveryCost)}</span>
                  ) : (
                    <span className="text-[9px] font-black text-mare-green tracking-widest uppercase italic">
                      Pendiente
                    </span>
                  )}
                </div>
                {checkoutData.provincia && (
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-medium text-gray-400 truncate max-w-[200px]">
                        {checkoutData.metodoEntrega === 'domicilio' ? 'A domicilio: ' : 'Recogida: '}
                        {checkoutData.municipio}
                     </span>
                     <button
                        onClick={() => navigate('/pedido')}
                       className="text-[9px] font-black text-mare-green hover:underline uppercase tracking-wider ml-2"
                     >
                        Editar
                     </button>
                  </div>
                )}
                
                <div className="w-full border-b-2 border-mare-navy mt-4 mb-2"></div>
                
                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Total a pagar</p>
                    <p className="text-2xl sm:text-3xl font-black text-mare-navy leading-none tracking-tighter">
                      {formatPrice(subtotal + deliveryCost)}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                id="btn-checkout-desktop"
                variant="primary" 
                fullWidth 
                onClick={() => navigate('/pedido')}
                className="h-12 rounded-xl shadow-md font-black tracking-[0.15em] text-[10px] gap-2 group"
              >
                CONTINUAR AL CHECKOUT
                <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>          
          </div>`;

content = content.replace(/<div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200\/20 overflow-hidden">[\s\S]*?<\/div>\s*<\/div>/, newSummary);
fs.writeFileSync('src/pages/Cart.tsx', content);

