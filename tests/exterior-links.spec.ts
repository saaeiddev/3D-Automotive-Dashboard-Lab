import {test,expect} from '@playwright/test';

test('glass monitor links and complete car after zooming out',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('.loader')).toHaveCount(0,{timeout:30000});
 await page.getByRole('navigation',{name:'Camera presets'}).getByRole('button',{name:/Infotainment$/}).click();
 await page.waitForTimeout(1600);
 const urls=['https://amirsaeiddehghan.ir','https://azadistudio.ir','https://github.com/saaeiddev'];
 const labels=['Personal website','Azadi Studio','GitHub · saaeiddev'];
 for(let i=0;i<3;i++){
  const link=page.getByRole('link',{name:labels[i],exact:true});await expect(link).toBeVisible();await expect(link).toHaveAttribute('href',urls[i]);
  await context.route(urls[i]+'**',route=>route.fulfill({body:'Destination verified'}));
  const opened=context.waitForEvent('page');await link.click();const popup=await opened;await popup.waitForLoadState();expect(popup.url().replace(/\/$/, '')).toBe(urls[i]);await popup.close();
 }
 await page.screenshot({path:'test-results/glass-monitor-links.png'});
 const canvas=page.locator('canvas'),b=(await canvas.boundingBox())!;
 await page.mouse.move(b.x+b.width*.55,b.y+b.height*.5);
 await page.mouse.wheel(0,6000);await page.waitForTimeout(1500);
 await expect(page.getByRole('link',{name:labels[0],exact:true})).toBeHidden();
 await page.screenshot({path:'test-results/exterior-zoom.png'});
 await page.mouse.down();await page.mouse.move(b.x+b.width*.30,b.y+b.height*.35,{steps:12});await page.mouse.up();await page.waitForTimeout(700);
 await page.screenshot({path:'test-results/exterior-orbit.png'});
 await page.getByRole('navigation',{name:'Camera presets'}).getByRole('button',{name:/Driver$/}).click();await page.waitForTimeout(1600);
 await expect(page.getByRole('link',{name:labels[0],exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});
